import { Component } from '@angular/core';

import { LadderDatabaseService } from './../../services/database/ladder-database.service';
import { LoginService } from './../../services/login.service';
import { PendingDatabaseService } from './../../services/database/pending-database.service';
import { ChallengeDatabaseService } from './../../services/database/challenge-database.service';

@Component({
    selector: 'app-place-challenge',
    templateUrl: './place-challenge.component.html',
    styleUrls: [ './place-challenge.component.css']
})

export class PlaceChallengeComponent {

    public challengeMethod = 0; // will contain the user selection in how to challenge someone. 1 = linked 2 = anon
    public listOfGames; // will contain list of games
    public selectedGame: string; // will contain the game the user selects
    public listOfPlayers; // will contain a list of players for selected game
    private _listOfPendingChallenges; // for anon, contains list of pending anon challenges
    public selectedChallenger; // for anon challenges, will hold the challenger info
    public selectedDefender; // will contain the person being challenged
    private _user; // user login info
    private _listofPendingChallenges; // for anon: the list of pending challenges to avoid dupes
    private _listOfDBChallenges; // list of challenges in the database

    // progression flags
    public canSelectGame = true;
    public canSelectPlayer = false;
    public canSelectDefender = false;
    public linkNoPlayerWarning = false;
    public canConfirm = false;
    public submittedChallenge = 0; // displays succesful submit message based on challenge method

    constructor(private _ladderDB: LadderDatabaseService, private _login: LoginService, private _pending: PendingDatabaseService,
    private _challengeDB: ChallengeDatabaseService) {
        this._ladderDB.getGameList().subscribe(gameList => {
            // instantiate game list
            this.listOfGames = gameList;
        });

        this._login.getLoggedInUserObs().map(user => {
            const newUser = {
                email: user.email,
                displayName: user.displayName,
                photoUrl: user.photoURL,
                uid: user.uid
            };
            return newUser;
        })
        .subscribe(user => {
            this._user = user;
        });

        this._pending.getListOfPendingChallenges().subscribe(challengeList => {
            this._listOfPendingChallenges = challengeList;
            console.log('instantiated pending challenge list', this._listOfPendingChallenges);
        });

        this._challengeDB.getListOfChallenges().subscribe(challengeList => {
            this._listOfDBChallenges = challengeList;
        });
    } // end constructor

    public useLinked() {
        this.challengeMethod = 1;
        this.submittedChallenge = 0;
    }

    public useAnon() {
        this.challengeMethod = 2;
        this.submittedChallenge = 0;
    }

    public selectGame(game: string) {
        // set selected game and instantiate player list
        this.selectedGame = game;
        this._ladderDB.getPlayers(game).subscribe(playerList => {
            this.listOfPlayers = playerList;
            if (this.challengeMethod === 1) { // if the user is using linked method...

                // find the player that has a matching google id
                this.selectedChallenger = this.listOfPlayers.find(player => {
                    if (player.google === this._user.uid) {return true; }
                }); // end .find

                if (this.selectedChallenger) {
                    // only allow passage to next part if they picked a game that found a player
                    // console.log('found player:', this.selectedChallenger);
                    this.linkNoPlayerWarning = false;
                    this.canSelectGame = false;
                    this.canSelectDefender = true;
                } else {
                    // otherwise display the warning
                    this.linkNoPlayerWarning = true;
                }

            }
        });

        // progress to next section
        this.canSelectPlayer = true;
    }

    public selectPlayer(player) {
        // cancel select player if they have a linked google account
        if (player.google) {return; }
        this.selectedChallenger = player;
        this.canSelectGame = false;
        this.canSelectDefender = true;
        this.canSelectPlayer = false;
    }

    // method to make sure challenges are valid
    public challengeValidation(challenger, defender) {
        // default to true
        let result = true;

        // make sure rank difference is greater than 0 (i.e. theyre not challenging someone below them)
        // also make sure that the rank difference is less than 4 (i.e. theyre not challenging someone too high for them)
        const rankDiff = challenger.rank - defender.rank;
        if (rankDiff < 1 || rankDiff > 3) {result = false; }

        // see if the defender has a recent opponent id. if so, make sure its not matching the challnger
        if (defender.recentId) {
            if (defender.recentId === challenger.id) {result = false; }
        }

        // see if theyre defending against anyone
        if (defender.defendingAgainst) { result = false; }

        return result;

    } // end challenge validation

    public selectDefender(defender) {

        // abort confirmation if selected defender is not valid
        if (this.challengeValidation(this.selectedChallenger, defender) === false) {
            return;
        } else {
            this.selectedDefender = defender;
            this.canConfirm = true;
        }
    }

    public submitChallenge() {
        // challenge error codes: 0 - challenge valid, 1 - defender already has a challenge pending,
        // 2 - attacker already has a challenge pending, 3 - defender has one from DB, 4 - attacker has one from db
        // 5 - challenger is trying to challenge the same player twice in a row, 6 - challenger is rank 2 and challenging the champ too soon

        // validation
        let challengeErrorCode = 0;

        // begin validation from pending list
        if (this._listOfPendingChallenges.length === 0) {
            // if there are no challenges, then there can't be any dupes heh
            challengeErrorCode = 0;
        } else {
            this._listOfPendingChallenges.forEach(challenge => {
                if (challenge.defenderId === this.selectedDefender.id) { challengeErrorCode = 1; }
                if (challenge.challengerId === this.selectedChallenger.id) { challengeErrorCode = 2; }
            });
        } // end validation check from pending

        // begin validation check from challenge db
        if (this._listOfDBChallenges.length !== 0) {
            this._listOfDBChallenges.forEach(challenge => {
                if (challenge.defenderId === this.selectedDefender.id) { challengeErrorCode = 3; }
                if (challenge.challengerId === this.selectedChallenger.id) { challengeErrorCode = 4; }
            });
        }

        // make sure the challenger isn't challenging the same opponent twice in a row.. unless they are rank 2
        if (this.selectedChallenger.recentOpponent === this.selectedDefender.id && this.selectedChallenger.rank !== 2) {
            challengeErrorCode = 5;
        }

        // make sure opponent isnt rank 2 and challenging the opponent too early
        if (this.selectedChallenger.rank === 2 && this.selectedChallenger.champWait < Date.now()) {
            challengeErrorCode = 6;
        }

        switch (challengeErrorCode) {
            case 0:
            const challengeToBeApproved = {
                game: this.selectedGame,
                challengerName: this.selectedChallenger.name,
                challengerId: this.selectedChallenger.id,
                challengerRank: this.selectedChallenger.rank,
                defenderName: this.selectedDefender.name,
                defenderId: this.selectedDefender.id,
                defenderRank: this.selectedDefender.rank,
                dateSubmitted: new Date(),
                deadline: Date.now(),
            };

            if (this.selectedChallenger.google) {
                challengeToBeApproved['challengerGoogle'] = this.selectedChallenger.google;
            }

            if (this.selectedDefender.google) {
                challengeToBeApproved['defenderGoogle'] = this.selectedDefender.google;
            }

            if (this.challengeMethod === 1) {
                // push to challenge db
                const deadlineDate = Date.now() + 864000000; // new date + no. seconds in 10 days
                challengeToBeApproved.deadline = deadlineDate; // assign deadline to 10 days from now
                this._challengeDB.addChallenge(challengeToBeApproved);
                console.log('submitting:', challengeToBeApproved, 'attacker:', this.selectedChallenger, 'defender', this.selectedDefender);
                console.log('Challenge added to challenge DB');
                this.submittedChallenge = 1;
                this.startOver();
            }
            if (this.challengeMethod === 2) {
                // ANONYMOUS CHALLENGE SECTION
                this._pending.addPendingChallenge(challengeToBeApproved);
                console.log('challenge added to pending list');
                this.submittedChallenge = 2;
                this.startOver();
            }
                break;

            case 1:
                console.log('defender already has a challenge');
                alert(`The defender ${this.selectedDefender.name} already has a challenge pending approval`);
                break;

            case 2:
                console.log('attacker alredy has a challenge');
                alert(`The attacker ${this.selectedChallenger.name} already has a challenge pending approval`);
                break;
            case 3:
                console.log('defender has challenge in DB');
                alert(`The defender ${this.selectedDefender.name} already has a challenge posted and waiting to complete`);
                break;
            case 4:
                console.log('attacker has Challenge in DB');
                alert(`The attacker ${this.selectedChallenger.name} already has a challenge posted and waiting to complete`);
                break;
            case 5:
                alert('Challenger is trying to challenge the same opponent twice in a row');
                break;
            case 6:
                alert('Challenger is challenging the champ too soon after a failed attempt');
                break;
            default:
                console.log('Unknown error code passed. ');
                break;
        }



    }

    public startOver() {
        this.canSelectGame = true;
        this.canSelectPlayer = false;
        this.canSelectDefender = false;
        this.linkNoPlayerWarning = false;
        this.canConfirm = false;
        this.challengeMethod = 0;
    }
}
