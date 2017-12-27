import { Component } from '@angular/core';

import { LadderDatabaseService } from './../../services/database/ladder-database.service';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: [ './join.component.css']
})

export class JoinComponent {

    public gameList; // will contain list of games on the ladder
    public selectedGame: string // will contain game player clicked on

    constructor( private _ladderDB: LadderDatabaseService) {
        this._ladderDB.getGameList().subscribe(gameList =>
        this.gameList = gameList);
    }

    public selectGame(game: string) {
        this.selectedGame = game;
    }

}
