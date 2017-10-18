import { Injectable } from '@angular/core';

import Ladder from './../interfaces/ladder';
import Game from './../interfaces/game';
import Player from './../interfaces/player';

@Injectable()

export class LadderService {

    private ladder: Ladder = {tekken: null, mvci: null};

    private tekken: Game;
    private mvci: Game;

    constructor() {
        this.buildLadder();
    }

    private buildLadder() {
        const tempArr: any[] = [];
        const tempMarvel: any[] = [];
        // this.tekken.players = [];
        this.tekken = {title: 'Tekken 7', players: [] };
        this.mvci = {title: 'Marvel vs Capcom Infinite', players: [] };

        // LIST OF CURRENT TEKKEN LADDER
        tempArr.push(['Domezy', 'domezy', 2, 0, 1533, 'Win 2']);
        tempArr.push(['Reckless', 'Reckless', 1, 1, 1500, 'Lost 1']);
        tempArr.push(['El Rado', 'Eraldo_Coil', 2, 1, 1514, 'Won 1']);
        tempArr.push(['Fobi_Yo', 'Fobi_yo', 2, 2, 1501, 'Won 1']);
        tempArr.push(['Fleury14', 'LQFleury14', 1, 3, 1469, 'Lost 1']);
        tempArr.push(['Jard', 'Quiksilver1209', 0, 1, 1483, 'Lost 1']);
        tempArr.push(['Fernook', 'N/A', 0, 0, 1500, 'None']);
        tempArr.push(['Negaduck', 'DarkBurritoEX', 0, 0, 1500, 'None']);


        // LIST OF CURRENT MARVEL LADDER
        tempMarvel.push(['Fobi_Yo', 'Fobi_yo', 0, 0, 1500, 'Win 0']);
        tempMarvel.push(['Sigma349', '???', 0, 0, 1500, 'Lost 0']);
        tempMarvel.push(['Scythe', 'Scythe_Wielder', 0, 0, 1500, 'Won 0']);
        tempMarvel.push(['Domezy', 'domezy', 0, 0, 1500, 'Won 0']);
        tempMarvel.push(['KindaFresh', '', 0, 0, 1500, 'Won 0']);
        tempMarvel.push(['Negaduck', 'DarkBurritoEX', 0, 0, 1500, 'Won 0']);
        tempMarvel.push(['Fleury14', 'LQFleury14', 0, 0, 1500, 'Won 0']);


        for (let i = 0; i < tempArr.length; i++) { // instantiate players
            // console.log(tempArr[i]);
            this.tekken.players.push({
                name: tempArr[i][0],
                psnId: tempArr[i][1],
                wins: tempArr[i][2],
                losses: tempArr[i][3],
                elo: tempArr[i][4],
                streak: tempArr[i][5],
                rank: i + 1

            }); // end push


        } // end for

        for (let i = 0; i < tempMarvel.length; i++) { // instantiate players

            this.mvci.players.push({
                name: tempMarvel[i][0],
                psnId: tempMarvel[i][1],
                wins: tempMarvel[i][2],
                losses: tempMarvel[i][3],
                elo: tempMarvel[i][4],
                streak: tempMarvel[i][5],
                rank: i + 1

            }); // end push
        } // end for


        // put games into ladder
        this.ladder.tekken = this.tekken;
        this.ladder.mvci = this.mvci;

        console.log(this.ladder);
    } // end buildLadder

    public sortPlayers(game: string, stat: string, order: string) { // method of sorting players
        // NOTE: Order MUST be either 'a' or 'd' or sorting will fail.
        if (order === 'a') {
            this.ladder[game].players.sort(function(a, b) {return a[stat] - b[stat]; });
            console.log(`Players sorted in ascending order by ${stat}`);
        } else if (order === 'd') {
            this.ladder[game].players.sort(function(a, b) {return b[stat] - a[stat]; });
            console.log(`Players sorted in descending order by ${stat}`);
        } else {
            console.log('Error: Incorrect order passed to sort method.');
        }
    }

    public getPlayers(game: string) {
        if (!this.ladder[game]) {
            console.log('Incorrect game passed in getPlayers');
            return;
        } else {
            return this.ladder[game].players;
        }
    }
}
