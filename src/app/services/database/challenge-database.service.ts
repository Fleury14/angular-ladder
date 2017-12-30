import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';

import NewsItem from './../../interfaces/news-item';
import { AngularFireList, AngularFireObject, FirebaseOperation } from 'angularfire2/database/interfaces';

import ChallengeDB from './../../interfaces/challenge-db';

@Injectable()

export class ChallengeDatabaseService {

    constructor (private _database: AngularFireDatabase) {}

    public addChallenge(challenge: ChallengeDB) {
        this._database.list('/x-challenges').push(challenge);
    }

    public deleteChallenge(id) {
        this._database.list('/x-challenges').remove(id);
    }
}
