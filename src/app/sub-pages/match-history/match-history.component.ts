import { Component } from '@angular/core';
import MatchRecord from './../../interfaces/match-record';
import MatchRecordList from './../../classes/match-history-list';

@Component({
    selector: 'app-match-history',
    templateUrl: './match-history.component.html',
    styleUrls: [ './match-history.component.css' ]
})

export class MatchHistoryComponent {

    private historyList = new MatchRecordList;
    public recordDisplay: MatchRecord[] = [];

    constructor() {
        for (let i = 0; i < this.historyList.getMatchListLength(); i++) {
            this.recordDisplay.push(this.historyList.getMatchRecord(i));
        }
    }
}
