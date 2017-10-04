import { Component, AfterViewInit } from '@angular/core';

import Player from './../../interfaces/player';
import Game from './../../interfaces/game';
import Ladder from './../../interfaces/ladder';

import MasterLadder from './../../classes/masterLadder';

@Component({
    selector: 'app-standings',
    templateUrl: './standings.component.html',
    styleUrls: ['./standings.component.css']
})

export class StandingsComponent implements AfterViewInit {

    public masterLadder = new MasterLadder;

    ngAfterViewInit() {


    }
}
