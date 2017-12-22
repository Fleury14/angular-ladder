import { Component } from '@angular/core';

import { LadderDatabaseService } from './../../../services/database/ladder-database.service';

@Component({
    selector: 'app-admin-players',
    templateUrl: './player-management.component.html',
    styleUrls: [ './player-management.component.css']
})

export class PlayerManagementComponent {

    constructor(private _ladderDB: LadderDatabaseService) {}

    public initialize() {
        this._ladderDB.instantiation();
    }
}
