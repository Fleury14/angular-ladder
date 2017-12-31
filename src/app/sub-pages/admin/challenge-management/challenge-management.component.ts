import { Component } from '@angular/core';

import { PendingDatabaseService } from './../../../services/database/pending-database.service';
import { ChallengeDatabaseService } from './../../../services/database/challenge-database.service';

@Component({
    selector: 'app-admin-news',
    templateUrl: './challenge-management.component.html',
    styleUrls: [ './challenge-management.component.css' ]
})

export class ChallengeManagementComponent {

    public listOfPendingChallenges;

    constructor (private _pending: PendingDatabaseService, private _challengeDB: ChallengeDatabaseService) {
        this._pending.getListOfPendingChallenges().subscribe(pendingList => {
            this.listOfPendingChallenges = pendingList;
            console.log('list of pendings:', this.listOfPendingChallenges);
        });
    }

    public denyChallenge(id) {
        this._pending.deletePendingChallenge(id);
    }

}
