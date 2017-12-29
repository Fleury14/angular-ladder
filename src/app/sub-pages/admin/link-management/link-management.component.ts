import { Component } from '@angular/core';

import { PendingDatabaseService } from './../../../services/database/pending-database.service';
import { LadderDatabaseService } from './../../../services/database/ladder-database.service';

@Component({
    selector: 'app-admin-link',
    templateUrl: './link-management.component.html',
    styleUrls: [ './link-management.component.css']
})

export class LinkManagementComponent {

    public listOfPendingLinks; // will contain list of pending links

    constructor(private _ladderDB: LadderDatabaseService, private _pending: PendingDatabaseService) {
        this._pending.getListOfPending().map(gameList => {
            // use dunlavy RR tech to put key in object
            const pendingList = [];
            for (const pendKey in gameList[1]) {
                const pendLoop = gameList[1][pendKey];
                pendLoop.id = pendKey;
                pendingList.push(pendLoop);
            }
            return pendingList;
        })
        .subscribe(gameList => {
            this.listOfPendingLinks = gameList;
            console.log(this.listOfPendingLinks);
        });
    } // end constructor

    public deleteRequest(id) {
        if (confirm('Are youo sure you want to delete this request?')) {
            this._pending.deletePendingLink(id);
        }
    }

    public approveRequest(playerId, game, google, id) {
        if (confirm('Confirm updating this account with the shown google info')) {
            this._ladderDB.updateGoogle(playerId, game, google);
            this._pending.deletePendingLink(id);
        }
    }
}
