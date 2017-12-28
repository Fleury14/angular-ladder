import { Component } from '@angular/core';

import { PendingDatabaseService } from './../../../services/database/pending-database.service';

@Component({
    selector: 'app-admin-pending',
    templateUrl: './pending-management.component.html',
    styleUrls: [ './pending-management.component.css']
})

export class PendingManagementComponent {

    public pendingList; // will contain list of pending apps

    constructor(private _pending: PendingDatabaseService) {
        this._pending.getListOfPending().map(gameList => {
            const pendingList = [];
            for (const pendKey in gameList[0]) {
                const pendLoop = gameList[0][pendKey];
                pendLoop.id = pendKey;
                pendingList.push(pendLoop);
            }
            return pendingList;
        })
        .subscribe(gameList => {
            this.pendingList = gameList;
            console.log(this.pendingList);
        });
    }

}
