import { Component } from '@angular/core';

import { LadderDatabaseService } from './../../services/database/ladder-database.service';
import { LoginService } from './../../services/login.service';

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
    public selectedChallenger; // for anon challenges, will hold the challenger info
    private _user; // user login info

    // progression flags
    public canSelectGame = true;
    public canSelectPlayer = false;
    public canSelectDefender = false;
    public linkNoPlayerWarning = false;

    constructor(private _ladderDB: LadderDatabaseService, private _login: LoginService) {
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
                    if(player.google === this._user.uid) {return true; }
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

        return result;

    } // end challenge validation

    public startOver() {
        this.canSelectGame = true;
        this.canSelectPlayer = false;
        this.canSelectDefender = false;
        this.linkNoPlayerWarning = false;
        this.challengeMethod = 0; // will contain the user selection in how to challenge someone. 1 = linked 2 = anon
    }
}
