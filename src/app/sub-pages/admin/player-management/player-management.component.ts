import { Component, OnInit } from '@angular/core';

import { LadderDatabaseService } from './../../../services/database/ladder-database.service';

@Component({
    selector: 'app-admin-players',
    templateUrl: './player-management.component.html',
    styleUrls: [ './player-management.component.css']
})

export class PlayerManagementComponent implements OnInit {

    public tekkenPlayers;

    constructor(private _ladderDB: LadderDatabaseService) {

    }

    ngOnInit() {
        this._ladderDB.getPlayers('tekken').subscribe(data => {
            this.tekkenPlayers = data;
        });
    }
    // public initialize() {
    //     this._ladderDB.instantiation();
    // }
}
