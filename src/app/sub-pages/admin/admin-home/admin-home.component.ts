import { Component } from '@angular/core';

import { PendingDatabaseService } from './../../../services/database/pending-database.service';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: [ './admin-home.component.css' ]
})

export class AdminHomeComponent {
    public numOfJoins;
    public numOfLinks;
    public numOfChallenges;
    public numOfResults;

    constructor(private _pendingDB: PendingDatabaseService) {
        this._pendingDB.getNumOfJoin().subscribe(length => {
            this.numOfJoins = length;
        });
        this._pendingDB.getNumOfLinks().subscribe(length => {
            this.numOfLinks = length;
        });
        this._pendingDB.getNumOfChallenges().subscribe(length => {
            this.numOfChallenges = length;
        });
        this._pendingDB.getNumOfResults().subscribe(length => {
            this.numOfResults = length;
        });
    }
}
