import { Component } from '@angular/core';

import { MatchHistoryDatabaseService } from './../../../services/database/match-history-database.service';

@Component({
    selector: 'app-admin-match-history',
    templateUrl: './match-history-management.html',
    styleUrls: [ './match-history-management.css']
})

export class MatchHistoryManagementComponent {

    public listOfMatches;

    constructor(private _matchDB: MatchHistoryDatabaseService) {
        this._matchDB.getListOfMatches().subscribe(matchList => {
            this.listOfMatches = matchList;
        });
    }

    public deleteMatch(id) {
        if (confirm('Are you sure you want to delete this match from the database?')) {
            console.log('deleting match with id:', id);
            this._matchDB.deleteMatch(id);
        }
    }
}
