import { Component, AfterViewInit } from '@angular/core';

import Player from './../../interfaces/player';
import Game from './../../interfaces/game';
import Ladder from './../../interfaces/ladder';

import MasterLadder from './../../classes/masterLadder';
declare var $: any;

@Component({
    selector: 'app-standings',
    templateUrl: './standings.component.html',
    styleUrls: ['./standings.component.css']
})

export class StandingsComponent implements AfterViewInit {

    public masterLadder = new MasterLadder;

    ngAfterViewInit() {
        /*global tekken, playerSort, $, ladder */
        // const tableBody = document.querySelector('#table-body');

        // function drawTable(game) { // function for drawing a games table...
        // // **NOTE*** The jquery destination will eventually have to be a parameter

        //     $(tableBody).html(``); // reset the table
        //     for (const [index, player] of ladder[game].players.entries()) { // loop through each player
        //         // console.log(index, player);

        //         $(tableBody).append(`
        //         <tr>
        //             <th>${player.rank}</th>
        //             <td>${player.name}</td>
        //             <td>${player.psnId}</td>
        //             <td>${player.wins}-${player.losses}</td>
        //             <td>${player.elo}</td>
        //             <td>${player.streak}</td>
        //         </tr>
        //         `);
        //     } // end for..of
        // } // end drawTable

        // drawTable('tekken');

        // // add event listeners for sort buttons
        // document.getElementById('sort-rank').addEventListener('click', function() {
        //     playerSort('tekken', 'rank', 'a');
        //     drawTable('tekken');
        // });

        // document.getElementById('sort-elo').addEventListener('click', function() {
        //     playerSort('tekken', 'elo', 'd');
        //     drawTable('tekken');
        // });

        // document.getElementById('sort-wins').addEventListener('click', function() {
        //     playerSort('tekken', 'wins', 'd');
        //     drawTable('tekken');
        // });

        // document.getElementById('sort-losses').addEventListener('click', function() {
        //     playerSort('tekken', 'losses', 'd');
        //     drawTable('tekken');
        // });

        // function Player(name, psnId, wins, losses, elo, streak) {
        //     this.name = name;
        //     this.psnId = psnId;
        //     this.wins = wins;
        //     this.losses = losses;
        //     this.elo = elo;
        //     this.streak = streak;
        //     this.rank = 0;
        // }

        // function Game(title, players) {
        //     this.title = title;
        //     this.players = players;
        // }

        // const ladder = {
        //     tekken: {},
        //     mvci: {}
        // };

        // // Tekken player declarations
        // const domezyT7 = new Player('Domezy', 'domezy', 2, 0, 1533, 'Win 2');
        // const recklessT7 = new Player ('Reckless', 'Reckless', 1, 1, 1500, 'Lost 1');
        // const elRadoT7 = new Player ('El Rado', 'Eraldo_Coil', 2, 1, 1514, 'Won 1');
        // const fobiYoT7 = new Player ('Fobi_Yo', 'Fobi_yo', 2, 2, 1501, 'Won 1');
        // const fleuryT7 = new Player('Fleury14', 'LQFleury14', 1, 3, 1469, 'Lost 1');
        // const jardT7 = new Player('Jard', 'Quiksilver1209', 0, 1, 1483, 'Lost 1');
        // const fernookT7 = new Player('Fernook', 'N/A', 0, 0, 1500, 'None');
        // const negaDuckT7 = new Player('Negaduck', 'DarkBurritoEX', 0, 0, 1500, 'None');

        // // tekken game declaration

        // const tekken = new Game('Tekken 7', [domezyT7, recklessT7, elRadoT7, fobiYoT7, fleuryT7, jardT7, fernookT7, negaDuckT7] );
        // const mvci = new Game('Marvel vs Capcom: Infinite', []);
        // // console.log(tekken);

        // // ladder declaration
        // ladder.tekken = tekken;
        // ladder.mvci = mvci;

        // function playerSort(game, stat, order) { // sorting function.
        // // **NOTE** Order MUST BE 'a' or 'd' or the sort will spit an error

        //     if (order === 'a') { // ascending order
        //         ladder[game].players.sort(function(a, b){return a[stat] - b[stat]; });
        //     } else if (order === 'd') { // descending order
        //         ladder[game].players.sort(function(a, b){return b[stat] - a[stat]; });
        //     } else {
        //         console.log(`Error sorting: ${order} must be 'a' or 'd'`);
        //     }
        // }
        // initial rank

        // for (let [index, player] of ladder.tekken.players.entries()) {
        //     player.rank = index + 1;
        // }

    }
}
