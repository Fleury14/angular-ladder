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
        return this._database.list('/x-challenges').valueChanges().map( challengeList => {

            const listOfKeys = [];
            this._database.list('/x-challenges/').snapshotChanges().subscribe(snapshotList => {
                snapshotList.forEach(function(snapshot) {
                    listOfKeys.push(snapshot.key);
                });
                challengeList.forEach(function(pendingItem, index) {challengeList[index]['id'] = listOfKeys[index]; });
            });
            return challengeList;
        });
    }
}
