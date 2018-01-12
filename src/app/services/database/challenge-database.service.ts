import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';
import { LadderDatabaseService } from './../database/ladder-database.service';

import NewsItem from './../../interfaces/news-item';
import { AngularFireList, AngularFireObject, FirebaseOperation } from 'angularfire2/database/interfaces';

import ChallengeDB from './../../interfaces/challenge-db';

@Injectable()

export class ChallengeDatabaseService {

    private _challengeList;
    private _currentPlayerList;

    constructor (private _database: AngularFireDatabase, private _ladderDB: LadderDatabaseService) {
        this.getListOfChallenges().subscribe(list => {
            this._challengeList = list;
        });
    }

    public addChallenge(challenge: ChallengeDB) {
        this._database.list('/x-challenges').push(challenge);
    }

    public matchChallengeRank() {
        this._challengeList.forEach(challenge => {
            const foundChallenge = [];
            this._ladderDB.getPlayers(challenge.game).subscribe(playerList => {
                playerList.forEach(player => {
                    if (player.id === challenge.challengerId) {
                        console.log('Match found - Challenger');
                        if (player.rank === challenge.challengerRank) {
                            console.log('Ranks match');
                        } else {
                            console.log('Ranks do NOT match');
                        }
                    }
                    if (player.id === challenge.defenderId) {
                        console.log('Match found - Defender');
                        if (player.rank === challenge.challengerRank) {
                            console.log('Ranks match');
                        } else {
                            console.log('Ranks do NOT match');
                        }
                    }
                });
            });
        });
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
