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

    public getListOfMatches() {
        return this._database.list('/y-match-history').valueChanges().map( matchList => {

            const listOfKeys = [];
            this._database.list('/y-match-history/').snapshotChanges().subscribe(snapshotList => {
                snapshotList.forEach(function(snapshot) {
                    listOfKeys.push(snapshot.key);
                });
                matchList.forEach(function(pendingItem, index) {matchList[index]['id'] = listOfKeys[index]; });
            });
            // sort matched in descending order by datecompleted
            matchList.sort(function(a, b) { return b['dateCompleted'] - a['dateCompleted']; });
            return matchList;
        });
    }
}
