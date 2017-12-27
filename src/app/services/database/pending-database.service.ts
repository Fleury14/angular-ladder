import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';

import NewsItem from './../../interfaces/news-item';
import { AngularFireList, AngularFireObject, FirebaseOperation } from 'angularfire2/database/interfaces';

@Injectable()

export class PendingDatabaseService {
    
    constructor( private _database: AngularFireDatabase ) {}

    public checkForDupes() {}

    public addPending(pending) {
        this._database.list('/w-pending/join').push(pending);
    }

}
