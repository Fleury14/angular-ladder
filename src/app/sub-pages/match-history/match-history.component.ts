import { Component } from '@angular/core';
import MatchRecord from './../../interfaces/match-record';
import { MatchHistoryService } from './../../services/match-history.service';
import { MatchHistoryDatabaseService } from './../../services/database/match-history-database.service';

@Component({
    selector: 'app-match-history',
    templateUrl: './match-history.component.html',
    styleUrls: [ './match-history.component.css' ]
})

export class MatchHistoryComponent {

    public listOfMatches;
    public recordDisplay: MatchRecord[] = [];

    constructor(private historyList: MatchHistoryService, private _matchDB: MatchHistoryDatabaseService) {
        for (let i = 0; i < this.historyList.getMatchListLength(); i++) {
            this.recordDisplay.push(this.historyList.getMatchRecord(i));
        }
        this._matchDB.getListOfMatches().subscribe(matchList => {
            this.listOfMatches = matchList;
        });
    }
}
