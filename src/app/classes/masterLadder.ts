import Player from './../interfaces/player';
import Game from './../interfaces/game';
import Ladder from './../interfaces/ladder';

export default class MasterLadder {
    private ladder: Ladder = {tekken: null, mvci: null};

    private tekken: Game = {title: 'Tekken 7', players: [] };
    private mvci: Game = {title: 'Marvel vs Capcom Infinite', players: [] };


    constructor() {

        this.buildLadder();
    }

    private buildLadder() {
        const tempArr: any[] = [];
        // this.tekken.players = [];

        tempArr.push(['Domezy', 'domezy', 2, 0, 1533, 'Win 2']);
        tempArr.push(['Reckless', 'Reckless', 1, 1, 1500, 'Lost 1']);
        tempArr.push(['El Rado', 'Eraldo_Coil', 2, 1, 1514, 'Won 1']);
        tempArr.push(['Fobi_Yo', 'Fobi_yo', 2, 2, 1501, 'Won 1']);
        tempArr.push(['Fleury14', 'LQFleury14', 1, 3, 1469, 'Lost 1']);
        tempArr.push(['Jard', 'Quiksilver1209', 0, 1, 1483, 'Lost 1']);
        tempArr.push(['Fernook', 'N/A', 0, 0, 1500, 'None']);
        tempArr.push(['Negaduck', 'DarkBurritoEX', 0, 0, 1500, 'None']);

        for (let i = 0; i < tempArr.length; i++) { // instantiate players
            console.log(tempArr[i]);
            this.tekken.players.push(tempArr[i]);
        }


        // put games into ladder
        this.ladder.tekken = this.tekken;
        this.ladder.mvci = this.mvci;

        console.log(this.ladder);
    }
}
