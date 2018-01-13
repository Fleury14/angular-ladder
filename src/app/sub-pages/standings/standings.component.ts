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

        // instantiate list of player then sort by rank ascending
        this._ladderDB.getGameList().subscribe(gameList => {
            this.listOfGames = gameList;
            this.listOfGames.forEach(game => {
                this._ladderDB.getPlayers(game.ref).subscribe(playerList => {
                    this.listOfPlayers[game.ref] = playerList;
                    this.listOfPlayers[game.ref].sort(function(a, b) { return a.rank - b.rank; });
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
        // check to see if stat is game pct as thats not a property but is an exception
        // otherwise make sure property exists on player list
        if (stat === 'gamepct') {
            console.log('sorting by game %');
            switch (order) {
                case 'a':
                    this.listOfPlayers[game].sort(function(a, b) {
                        if (a.gameWins === 0) { return -1; } else if (b.gameWins === 0) { return 1; } else {
                            return (a.gameWins / (a.gameWins + a.gameLosses)) - (b.gameWins / (b.gameWins + b.gameLosses));
                        }
                    });
                    break;

                case 'd':
                this.listOfPlayers[game].sort(function(a, b) {
                    if (b.gameWins === 0) { return -1; } else if (a.gameWins === 0) { return 1; } else {
                        return (b.gameWins / (b.gameWins + b.gameLosses)) - (a.gameWins / (a.gameWins + a.gameLosses));
                    }
                });
                    break;
            }
            return;

        } else if (this.listOfPlayers[game][0][stat] === undefined) {
            console.log('Bad property passed');
            return;
        }

        console.log(`sorting by ${stat}`);
        // check for ascending or descending order
        if (order === 'a') {
            this.listOfPlayers[game].sort(function(a, b) { return a[stat] - b[stat]; });
        } else if (order === 'd') {
            this.listOfPlayers[game].sort(function(a, b) { return b[stat] - a[stat]; });
        }

   } // end sortPlayerList

}
