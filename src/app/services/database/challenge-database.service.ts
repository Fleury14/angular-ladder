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

    public getListOfChallenges() {
        return this._database.list('/').valueChanges().map( database => {
            const challengeList = [];
            for (const challengeKey in database[3]) {
                const challengeLoop = database[3][challengeKey];
                challengeLoop.id = challengeKey;
                challengeList.push(challengeLoop);
            }
            return challengeList;
        });
    }
}
