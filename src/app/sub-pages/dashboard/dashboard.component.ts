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
    private _user;

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

            this.listOfGames.forEach(game => {
                this.userStatus[game.ref] = [];

                this._ladderDB.getPlayers(game.ref).subscribe(playerList => {
                    playerList.forEach(player => {
                        console.log(`checking player ${player.name} in ${game.ref}`);
                        if (player.google === this._user.uid) {
                            console.log('match found:', player);
                            this.userStatus[game.ref].push(player);
                            console.log('new user status:', this.userStatus);
                        }
                    });
                });
            });
            // console.log('User status:', this.userStatus);
        });

    }

}
