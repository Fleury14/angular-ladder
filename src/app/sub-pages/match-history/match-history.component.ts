import { Component } from '@angular/core';
import MatchRecord from './../../interfaces/match-record';
import { MatchHistoryService } from './../../services/match-history.service';

@Component({
    selector: 'app-match-history',
    templateUrl: './match-history.component.html',
    styleUrls: [ './match-history.component.css' ]
})

export class MatchHistoryComponent {


    public recordDisplay: MatchRecord[] = [];

    constructor(private historyList: MatchHistoryService) {
        for (let i = 0; i < this.historyList.getMatchListLength(); i++) {
            this.recordDisplay.push(this.historyList.getMatchRecord(i));
        }
    }
}
