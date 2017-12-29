import { Component } from '@angular/core';

import { LoginService } from './../../services/login.service';
import { LadderDatabaseService } from './../../services/database/ladder-database.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.css']
})

export class DashboardComponent {

    public listOfGames; // will contain list of games
    public userStatus = {}; // will contain user status on each ladder
    private _user; // will contain logged in user info
    public allowLink = false; // will determine if a player is linking an account
    public selectedGame; // will contain the game that the user wants to link an account to

    constructor(public login: LoginService, private _ladderDB: LadderDatabaseService) {

        this.login.getLoggedInUserObs().map(user => {
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

    } // end constructor

    public beginLink(game: string) {
        this.selectedGame = game;
        this.allowLink = true;
    }

    public cancelLink() {
        this.selectedGame = null;
        this.allowLink = false;
    }

}
