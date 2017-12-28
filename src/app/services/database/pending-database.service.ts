import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';

import NewsItem from './../../interfaces/news-item';
import { AngularFireList, AngularFireObject, FirebaseOperation } from 'angularfire2/database/interfaces';

@Injectable()

export class PendingDatabaseService {

    private _listOfPending;
    private _MAXPENDING = 30; // maximum number of pending entries

    constructor( private _database: AngularFireDatabase ) {
        this._database.list('/w-pending/join').valueChanges().subscribe(pendingList => {
            this._listOfPending = pendingList;
        });
    }

    public checkForDupes(game: string, psnId: string) {

        let dupeCheck = false;

        this._listOfPending.forEach(pending => {
            // console.log(`Checking incoming ${psnId} vs iteration ${pending.psnId}`);
            if (pending.psnId === psnId && pending.game === game) {
                dupeCheck = true;
            }
        });

        return dupeCheck;
    }

    public pendingFull() {
        if (this._listOfPending >= this._MAXPENDING) {
            return true;
        } else {
            return false;
        }
    }

    public getListOfPending() {
        return this._database.list('/w-pending/').valueChanges();
    }

    public addPending(pending) {
        this._database.list('/w-pending/join').push(pending);
    }

    public deletePending(id) {
        this._database.list('/w-pending/join').remove(id);
    }

}
