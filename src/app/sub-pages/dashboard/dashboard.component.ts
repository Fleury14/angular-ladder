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

    constructor(public login: LoginService, private _ladderDB: LadderDatabaseService) {

        // instantiate list of games.
        this._ladderDB.getGameList().subscribe(gameList => {
            this.listOfGames = gameList;
        });

    }

}
