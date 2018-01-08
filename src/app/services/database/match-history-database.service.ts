import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';

import { AngularFireList, AngularFireObject, FirebaseOperation } from 'angularfire2/database/interfaces';

@Injectable()

export class MatchHistoryDatabaseService {

    constructor (private _database: AngularFireDatabase) {}

    public addMatch(match) {
        this._database.list('/y-match-history').push(match);
    }

    public deleteMatch(id) {
        this._database.list('/y-match-history').remove(id);
    }

    public getMatchListSnapshot() {
        return this._database.list('/y-match-history').snapshotChanges();
    }

    public getListOfMatches() {
        return this._database.list('/y-match-history').snapshotChanges().map(data => {
            const matchList = [];
            data.forEach(match => {
                const loopedMatch = match.payload.val();
                loopedMatch.id = match.key;
                matchList.push(loopedMatch);
            });
            matchList.sort(function(a, b) {
                return b.dateCompleted - a.dateCompleted;
            });
            return matchList;
        });
    }

}
