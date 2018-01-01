import { Component } from '@angular/core';

import { PendingDatabaseService } from './../../../services/database/pending-database.service';
import { ChallengeDatabaseService } from './../../../services/database/challenge-database.service';
import { LadderDatabaseService } from './../../../services/database/ladder-database.service';

@Component({
    selector: 'app-admin-news',
    templateUrl: './challenge-management.component.html',
    styleUrls: [ './challenge-management.component.css' ]
})

export class ChallengeManagementComponent {

    public listOfPendingChallenges; // will contain a list of anon chasllenges that are pending
    public listOfActiveChallenges; // will conatin a list of active challenges
    public listOfResults; // will contain list of results
    public listOfAffectedPlayers; // will container players on a ladder whos rank will change
    private _currentDefender; // will contain the player which is defending a challenge for purpose of result posting

    constructor (private _pending: PendingDatabaseService, private _challengeDB: ChallengeDatabaseService,
        private _ladderDB: LadderDatabaseService) {
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

    // method to delete a result
    public deleteResult(id) {
        if (confirm('Are you sure you want to delete this result?')) {
            this._pending.deleteResult(id);
        }
    }

    public approveResult(result) {
        this.listOfAffectedPlayers = [];
        this._currentDefender = null;
        this._ladderDB.getPlayers(result.game).subscribe(playerList => {
            this._currentDefender = playerList.find(function(e, i, a) {
                if (e.id === result.defenderId) { return true; }
            });
            for (let rank = result.defenderRank - 1; rank < result.challengerRank; rank++ ) {
                this.listOfAffectedPlayers.push(playerList[rank]);
            }
            console.log('affected players:', this.listOfAffectedPlayers);
            console.log('current defender', this._currentDefender);
            const lastIndex = this.listOfAffectedPlayers.length - 1;
            this.listOfAffectedPlayers[lastIndex].recentOpponent = result.defenderId;
            if (result.challengerScore > result.defenderScore) {
                this._winAdjust(result);
            }
            if (result.challengerScore < result.defenderScore) {
                this._lossAdjust(result);
            }
            if (result.challengerScore === result.defenderScore) {
                console.log('ERROR: I dont know what to do with a tie :(');
            }
        });
    }

    // method to make player adjustments based off a challenger win
    private _winAdjust(result) {
        const lastIndex = this.listOfAffectedPlayers.length();
    }

    // method to make player adjustments based off a defender win
    private _lossAdjust(result) {}

    public unixConvert(unix: number): Date {
        return new Date(unix);
    }

}
