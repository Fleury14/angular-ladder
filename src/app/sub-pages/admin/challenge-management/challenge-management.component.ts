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
    public listOfActiveChallenges;

    constructor (private _pending: PendingDatabaseService, private _challengeDB: ChallengeDatabaseService) {
        this._pending.getListOfPendingChallenges().subscribe(pendingList => {
            this.listOfPendingChallenges = pendingList;
            console.log('list of pendings:', this.listOfPendingChallenges);
        });

        this._challengeDB.getListOfChallenges().subscribe(challengeList => {
            this.listOfActiveChallenges = challengeList;
            console.log('list of actives:', this.listOfActiveChallenges);
        });
    }

    public denyChallenge(id) {
        this._pending.deletePendingChallenge(id);
    }

    public approveChallenge(challenge, id) {
        if (confirm('Confirm adding selected challenge to official challenge list')) {
            challenge['deadline'] = Date.now() + 864000000;
            this._pending.deletePendingChallenge(id);
            challenge.id = null;
            console.log('submitting challenge:', challenge);
            this._challengeDB.addChallenge(challenge);

        }

    }

    public deleteActiveChallenge(id) {
        if (confirm('Are you sure you want to delete this challenge?')) {
            this._challengeDB.deleteChallenge(id);
        }
    }

}
