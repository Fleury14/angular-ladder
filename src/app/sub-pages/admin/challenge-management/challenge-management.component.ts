import { Component } from '@angular/core';

import { PendingDatabaseService } from './../../../services/database/pending-database.service';
import { ChallengeDatabaseService } from './../../../services/database/challenge-database.service';

@Component({
    selector: 'app-admin-news',
    templateUrl: './challenge-management.component.html',
    styleUrls: [ './challenge-management.component.css' ]
})

export class ChallengeManagementComponent {

    public listOfPendingChallenges; // will contain a list of anon chasllenges that are pending
    public listOfActiveChallenges; // will conatin a list of active challenges
    public listOfResults; // will contain list of results

    constructor (private _pending: PendingDatabaseService, private _challengeDB: ChallengeDatabaseService) {
        this._pending.getListOfPendingChallenges().subscribe(pendingList => {
            this.listOfPendingChallenges = pendingList;
            // onsole.log('list of pendings:', this.listOfPendingChallenges);
        });

        this._challengeDB.getListOfChallenges().subscribe(challengeList => {
            this.listOfActiveChallenges = challengeList;
            // console.log('list of actives:', this.listOfActiveChallenges);
        });

        this._pending.getListOfResults().subscribe(resultList => {
            this.listOfResults = resultList;
        });
    }

    // method to deny challenge. deletes it from the pending list
    public denyChallenge(id) {
        this._pending.deletePendingChallenge(id);
    }

    // method to approve challenge. deletes it from the pending list and adds to active challenges
    public approveChallenge(challenge, id) {
        if (confirm('Confirm adding selected challenge to official challenge list')) {
            // add 10 days in ubnix time to the current date to pass correct deadling
            challenge['deadline'] = Date.now() + 864000000;
            this._pending.deletePendingChallenge(id);
            challenge.id = null; // remove the challenge id from the pending list so that its not confused with the id in the challenge list
            console.log('submitting challenge:', challenge);
            this._challengeDB.addChallenge(challenge);

        }

    }

    // method to delete an active challenge from the database
    public deleteActiveChallenge(id) {
        if (confirm('Are you sure you want to delete this challenge?')) {
            this._challengeDB.deleteChallenge(id);
        }
    }

    public unixConvert(unix: number): Date {
        return new Date(unix);
    }

}
