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

        this._user = this.login.getLoggedInUser();

        // instantiate list of games.
        this._ladderDB.getGameList().subscribe(gameList => {
            this.listOfGames = gameList;

            this.listOfGames.forEach(game => {
                this.userStatus[game.ref] = [];
                
                this._ladderDB.getPlayers(game.ref).map(playerList => {
                    playerList.forEach(player => {
                        if (player.google) {}
                    });
                });
            });
            console.log('User status:', this.userStatus, this._user);
        });

    }

}
