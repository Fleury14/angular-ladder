import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatchHistoryDatabaseService } from './../../../services/database/match-history-database.service';

@Component({
    selector: 'app-admin-match-history',
    templateUrl: './match-history-management.html',
    styleUrls: [ './match-history-management.css']
})

export class MatchHistoryManagementComponent implements OnInit, OnDestroy {

    public listOfMatches;
    private _matchListSub;

    constructor(private _matchDB: MatchHistoryDatabaseService) {
    }

    ngOnInit() {
        this._matchListSub = this._matchDB.getListOfMatches().subscribe(matchList => {
            this.listOfMatches = matchList;
        });
    }

    ngOnDestroy() {
        this._matchListSub.unsubscribe();
    }

    public deleteMatch(id) {
        if (confirm('Are you sure you want to delete this match from the database?')) {
            console.log('deleting match with id:', id);
            this._matchDB.deleteMatch(id);
        }
    }
}
