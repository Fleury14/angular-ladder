import { Component, OnInit } from '@angular/core';

import { LadderDatabaseService } from './../../../services/database/ladder-database.service';

@Component({
    selector: 'app-admin-players',
    templateUrl: './player-management.component.html',
    styleUrls: [ './player-management.component.css']
})

export class PlayerManagementComponent implements OnInit {

    public tekkenPlayers;
    public selectedPlayer;
    public gameList;
    public currentGame = {
        title: '',
        ref: ''
    }

    constructor(private _ladderDB: LadderDatabaseService) {
        this._ladderDB.getGameList().subscribe(data => {
            this.gameList = data;
        });
    }

    ngOnInit() {
        this._ladderDB.getPlayers('tekken').subscribe(data => {
            this.tekkenPlayers = data;
        });
    }

    public displayPlayerInfo(id) {
       this.selectedPlayer = this.tekkenPlayers.find(player => player.id === id);
       console.log(this.selectedPlayer);
    }

    public switchGame(ref, title) {
        this.currentGame.ref = ref;
        this.currentGame.title = title;
    }

    // public initialize() {
    //     this._ladderDB.instantiation();
    // }
}
