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
            const playerSub = this._ladderDB.getPlayers(challenge.game).subscribe(playerList => {
                playerList.forEach(player => {
                    if (player.id === challenge.challengerId) {
                        console.log('Match found - Challenger');
                        if (player.rank === challenge.challengerRank) {
                            console.log('Ranks match');
                        } else {
                            console.log('Ranks do NOT match');
                            console.log(`${challenge.challengerName}'s rank is ${challenge.challengerRank} but is ${player.rank} on the ladder.`);
                            challenge.challengerRank = player.rank;
                            console.log('Send the following object with updates to the challenge:', challenge);
                        }
                    }
                    if (player.id === challenge.defenderId) {
                        console.log('Match found - Defender');
                        if (player.rank === challenge.defenderRank) {
                            console.log('Ranks match');
                        } else {
                            console.log('Ranks do NOT match');
                            console.log(`${challenge.defenderName}'s rank is ${challenge.defenderRank} but is ${player.rank} on the ladder.`);
                            challenge.defenderRank = player.rank;
                            console.log('Send the following object with updates to the challenge:', challenge);
                        }
                    }
                });
                playerSub.unsubscribe();
            });
        });
    }

    public updateChallenger(id, challenge) {
        const challengeRef = this._database.list('/x-challenges');
        challengeRef.update(id, challenge);
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
