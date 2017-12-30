import { Component } from '@angular/core';

import { LadderDatabaseService } from './../../services/database/ladder-database.service';
import { LoginService } from './../../services/login.service';
import { PendingDatabaseService } from './../../services/database/pending-database.service';

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

    // progression flags
    public canSelectGame = true;
    public canSelectPlayer = false;
    public canSelectDefender = false;
    public linkNoPlayerWarning = false;
    public canConfirm = false;

    constructor(private _ladderDB: LadderDatabaseService, private _login: LoginService, private _pending: PendingDatabaseService) {
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
    } // end constructor

    public useLinked() {
        this.challengeMethod = 1;
    }

    public useAnon() {
        this.challengeMethod = 2;
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
        if (this.challengeValidation(this.selectedChallenger, defender) == false) {
            return;
        } else {
            this.selectedDefender = defender;
            this.canConfirm = true;
        }
    }

    public submitChallenge() {
        // challenge error codes: 0 - challenge valid, 1 - defender already has a challenge pending,
        // 2 - attacker already has a challenge pending

        if (this.challengeMethod === 2) {
            // ANONYMOUS CHALLENGE SECTION
            // validation
            let challengeErrorCode = 0;

            if (this._listOfPendingChallenges.length === 0) {
                // if there are no challenges, then there can't be any dupes heh
                challengeErrorCode = 0;
            } else {
                this._listOfPendingChallenges.forEach(challenge => {
                    if (challenge.defenderId === this.selectedDefender.id) { challengeErrorCode = 1; }
                    if (challenge.challengerId === this.selectedChallenger.id) { challengeErrorCode = 2; }
                });

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
                        dateSubmitted: new Date()
                    };
                    this._pending.addPendingChallenge(challengeToBeApproved);
                    break;

                case 1:
                    console.log('defender already has a challenge');
                    alert(`The defender ${this.selectedDefender.name} already has a challenge pending`);
                    break;

                case 2:
                    console.log('attacker alredy has a challenge');
                    alert(`The attacker ${this.selectedChallenger.name} already has a challenge pending`);
                    break;
            }


        }
    }

    public startOver() {
        this.canSelectGame = true;
        this.canSelectPlayer = false;
        this.canSelectDefender = false;
        this.linkNoPlayerWarning = false;
        this.canConfirm = false;
        this.challengeMethod = 0; // will contain the user selection in how to challenge someone. 1 = linked 2 = anon
    }
}
