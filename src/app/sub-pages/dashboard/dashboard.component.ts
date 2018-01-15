import { Component, OnInit } from '@angular/core';

import { LoginService } from './../../services/login.service';
import { LadderDatabaseService } from './../../services/database/ladder-database.service';
import { PendingDatabaseService } from './../../services/database/pending-database.service';
import { ChallengeDatabaseService } from './../../services/database/challenge-database.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    public listOfGames; // will contain list of games
    public userStatus = {}; // will contain user status on each ladder
    private _user; // will contain logged in user info
    public selectedGame; // will contain the game that the user wants to link an account to
    public listOfPlayers; // will contain the list of players for the game that the user selected to link an account to
    public listOfChallenges = { // will contain list of active challenges
        att: [],
        def: []
    };

    // result posting fields
    public selectedChallenge; // will contain the challenge that the user wants to post a result on
    public challengerScore: number;
    public defenderScore: number;

    // display flags
    public displaySubmitMessage = false; // pretty self explanatory
    public allowLink = false; // will determine if a player is linking an account
    public linkDupeWarning = false;
    public allowPost = false; // flag to toggle viewing the posting of challenge results
    public submittedResult = false; // flag to display submitted message

    // instantiate necessary lists...
    ngOnInit() {
         // ..login info
         this.login.getLoggedInUserObs().map(user => {
             if (user) {
                const newUser = {
                    email: user.email,
                    displayName: user.displayName,
                    photoUrl: user.photoURL,
                    uid: user.uid
                };
                return newUser;
             } else {
                 return null;
             }
        })
        .subscribe(user => {
            this._user = user;
        });

        // instantiate list of games.
        this._ladderDB.getGameList().subscribe(gameList => {
            this.listOfGames = gameList;

            // go through each game to search for players
            this.listOfGames.forEach(game => {
                this.userStatus[game.ref] = [];

                // grab a list of players and do a nested subscribe so we can iterate through the list.
                // NOTE: i thought .map would work here, but alas, it does not
                this._ladderDB.getPlayers(game.ref).subscribe(playerList => {

                    // now iterate through each player in the playerList
                    playerList.forEach(player => {
                        // console.log(`checking player ${player.name} in ${game.ref}`);
                        // if the iterated players google account matches the current users google ID,
                        // .push it to the userstatus property of the current game being iterated
                        if (player.google === this._user.uid) {
                            // console.log('match found:', player);
                            this.userStatus[game.ref].push(player);
                        } // end if
                    }); // end playerlist iteration
                }); // end getPlayers subscribe
            }); // end gamelist iteration
        }); // end gamelist subscribe

        // instantiate list of challenges then put them in teh correct array
        this._challengeDB.getListOfChallenges().subscribe(challengeList => {
            challengeList.forEach(challenge => {
                if (challenge['challengerGoogle'] === this._user.uid) {
                    // console.log('selected challenge', challenge);
                    this.listOfChallenges.att.push(challenge);
                }
                if (challenge['defenderGoogle'] === this._user.uid) {
                    // console.log('selected challenge', challenge);
                    // challenge['isPending'] = this.isResultPending(challenge['id']);
                    this.listOfChallenges.def.push(challenge);
                }
            });
            console.log('challengeArrayBefore', this.listOfChallenges);
            this.listOfChallenges.att.forEach(challenge => {
                console.log(challenge.id, challenge, challenge.deadline, challenge.id);
                challenge['isPending'] = this.isResultPending(challenge.challengerId, challenge.defenderId);
            });
            this.listOfChallenges.def.forEach(challenge => {
                challenge['isPending'] = this.isResultPending(challenge.challengerId, challenge.defenderId);
            });
            console.log('challenge array yarrr', this.listOfChallenges);
        });

    }
    constructor(public login: LoginService, private _ladderDB: LadderDatabaseService, private _pending: PendingDatabaseService,
    private _challengeDB: ChallengeDatabaseService, private _router: Router) { 
    } // end constructor

    // method to initiate linking a google account to a spot on the ladder. takes in the game ref from the appropriatte entry
    public beginLink(game: string) {
        this.selectedGame = game;
        this.allowLink = true;
        // instantiate list of players for selected game
        this._ladderDB.getPlayers(game).subscribe(playerList => {
            this.listOfPlayers = playerList;
        });
    }

    // method to cancel linking account
    public cancelLink() {
        this.selectedGame = null;
        this.allowLink = false;
    }

    // method of making sure a player has a google account. this is used to make sure someone doesnt overwrite a listing that already
    // has a google account
    public hasGoogle(index: number) {
        if (this.listOfPlayers[index].google) {return true;
        } else {return false; }
    }

    // method to actually link the player to a google account
    public linkPlayer(id: string, name: string) {

        // create player object
        const linkToBeAdded = {
            playerId: id,
            game: this.selectedGame,
            google: this._user.uid,
            name: name,
            email: this._user.email
        };
        // console.log('dupe check comp side:', this._pending.dupeLinkCheck(this.selectedGame, id));
        // make sure that theres not already a pending request to link this listing
        if (this._pending.dupeLinkCheck(this.selectedGame, id) === true) {
            // show dupe warning if thats the case
            this.linkDupeWarning = true;
            return;
        } else if (confirm(`Are you sure you want to link ${name} to your google account?`)) {
            // call method to link accounr, reset flags
            this._pending.addPendingLink(linkToBeAdded);
            this.linkDupeWarning = false;
            this.displaySubmitMessage = true;
        }
    }

    // method to allow user to begin entering results
    public postResults(challenge) {
        // designate appropraite challenge and set flags
        this.selectedChallenge = challenge;
        this.allowPost = true;
        this.submittedResult = false;
    }

    // method to submit score for approval
    public submitScores() {

        if (confirm(`Confirm Score: ${this.selectedChallenge.challengerName}-${this.challengerScore}, ${this.selectedChallenge.defenderName}-${this.defenderScore}`)) {
            // assign values from fields into challenge object
            // retain the ID from the challenge database so we can delete the challenge upon approving the score
            this.selectedChallenge['challengeDBId'] = this.selectedChallenge.id;
            // then reset the id so it can be filled with the id given in the pending results list
            this.selectedChallenge.id = null;
            this.selectedChallenge['challengerScore'] = this.challengerScore;
            this.selectedChallenge['defenderScore'] = this.defenderScore;
            // make sure there isn't already a score submission for this challenge
            if (this._pending.dupeResultCheck(this.selectedChallenge.challengeDBId) === true) {
                alert(`There's already a result pending approval for this challenge. Contact an admin if you feel this is an error.`);
            } else {
                // call method in service to add result to the database
                this._pending.addResult(this.selectedChallenge);
                this.allowPost = false;
                this.submittedResult = true;
                this._router.navigate(['/submit', {type: 'score-post'}]);
            }
        }
    }

    public forfeitChallenge(challenge: object, playerPos: string) {
        if (confirm('Do you reallt want to forfeit this challenge?')) {
            const pendingResult = challenge;
            let breakFlag = false;
            if (playerPos === 'c') {
                pendingResult['challengerForfeit'] = true;
            } else if (playerPos === 'd') {
                pendingResult['defenderForfeit'] = true;
            } else {
                console.log('Error: invalid argument for player position, must be "c" or "d"');
                breakFlag = true;
            }

            if (breakFlag === false) {
                pendingResult['challengeDBId'] = pendingResult['id'];
                pendingResult['id'] = null;
                console.log('submitting following forfeiture result:', pendingResult);
                this._pending.addResult(pendingResult);
            }
        }
    }

    public isResultPending(challId: string, defId: string) {
        return this._pending.isResultPending(challId, defId);
    }

    public joinLadder(game) {
        this._router.navigate(['/join', {game: game}]);
    }

    public unixConvert(unix: number): Date {
        return new Date(unix);
    }
}
