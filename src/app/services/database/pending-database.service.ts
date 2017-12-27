import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';

import NewsItem from './../../interfaces/news-item';
import { AngularFireList, AngularFireObject, FirebaseOperation } from 'angularfire2/database/interfaces';

@Injectable()

export class PendingDatabaseService {

    private _listOfPending;

    constructor( private _database: AngularFireDatabase ) {
        this._database.list('/w-pending/join').valueChanges().subscribe(pendingList => {
            this._listOfPending = pendingList;
        });
    }

    public checkForDupes(psnId: string) {

        let dupeCheck = false;

        this._listOfPending.forEach(pending => {
            if (pending.psnId === psnId) {
                dupeCheck = true;
            }
        });

        return dupeCheck;
    }

    public addPending(pending) {
        this._database.list('/w-pending/join').push(pending);
    }

}
