import { Component } from '@angular/core';

import { PendingDatabaseService } from './../../../services/database/pending-database.service';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: [ './admin-home.component.css' ]
})

export class AdminHomeComponent {
    public numOfJoins = 0;

    constructor(private _pendingDB: PendingDatabaseService) {
        this._pendingDB.getListOfPending().subscribe(list => {
            this.numOfJoins = list.length;
        });
    }
}
