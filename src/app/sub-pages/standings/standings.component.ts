import { Component, AfterViewInit } from '@angular/core';

import Player from './../../interfaces/player';
import Game from './../../interfaces/game';
import Ladder from './../../interfaces/ladder';

import MasterLadder from './../../classes/masterLadder';

import { LadderService } from './../../services/ladder.service';
import { LadderDatabaseService } from './../../services/database/ladder-database.service';

@Component({
    selector: 'app-standings',
    templateUrl: './standings.component.html',
    styleUrls: ['./standings.component.css']
})

export class StandingsComponent {

    public listOfGames;
    public listOfPlayers = {};

    constructor(public masterLadder: LadderService, private _ladderDB: LadderDatabaseService) {
        this.listOfPlayers = {};

        this._ladderDB.getGameList().subscribe(gameList => {
            this.listOfGames = gameList;
            this.listOfGames.forEach(game => {
                this._ladderDB.getPlayers(game.ref).subscribe(playerList => {
                    this.listOfPlayers[game.ref] = playerList;
                });
            });
        });
        console.log('Ladder initialized');
     } // end constructor

     public sortPlayerList(game, stat, order) {
        // console.log(`game: ${game} stat: ${stat}`);
        // console.log(this.listOfPlayers[game][0][stat]);
        if (order !== 'a' && order !== 'd') {
            console.log('bad order passed, please pass a or d');
            return;
        }

        // first check to make sure property exists on player list
        if (this.listOfPlayers[game][0][stat] === undefined) {
            console.log('Bad property passed');
            return;
        }

        // check for ascending or descending order
        if (order === 'a') {
            this.listOfPlayers[game].sort(function(a, b) { return a[stat] - b[stat]; });
        } else if (order === 'd') {
            this.listOfPlayers[game].sort(function(a, b) { return b[stat] - a[stat]; });
        }

   } // end sortPlayerList

}
