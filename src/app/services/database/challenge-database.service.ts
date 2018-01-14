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
    private _inServiceSub;

    constructor (private _database: AngularFireDatabase, private _ladderDB: LadderDatabaseService) {
        this._inServiceSub = this.getListOfChallenges().subscribe(list => {
            this._challengeList = list;
        });
    }

    public addChallenge(challenge: ChallengeDB) {
        this._database.list('/x-challenges').push(challenge).then(
            () => { console.log('Challenge Added.'); }
        );
    }

    // method used when updating the ranks on the challenge list to match the ranks on the ladder
    // not using this will cause a problem when players move around due to other challenges but their rank
    // on the challenge stays the same. for example if #5 challenged #4 then at the point of the challenge
    // those are the ranks eneter in. but lets say someone below them jumped them both and now they are #5 and #6
    // the challenge ranks are not updated and when the score goes to post, bad things happen. this resolves that problem
    public matchChallengeRank(flag: boolean) {
        // bonly run this when its called
        if (flag !== true) { return; }
        console.log('Updating ranks in Challenge DB...');
        // resub if necessary
        if (this._inServiceSub.closed === true) {
            // console.log('sub open');
            this._inServiceSub = this.getListOfChallenges().subscribe(list => {
                this._challengeList = list;
            });
            
        }
        // iterate through each challenge
        this._challengeList.forEach(challenge => {
            // grab a list of players and subscribe to it. assign it to a var so we can unsub later
            const playerSub = this._ladderDB.getPlayers(challenge.game).subscribe(playerList => {
                // iterate through each player on the list looking for a matching id
                playerList.forEach(player => {
                    // if the iterated player id matches the challenger id then we have a match, so we need to make sure the ranks are good
                    if (player.id === challenge.challengerId) {
                        // console.log('Match found - Challenger');
                        if (player.rank === challenge.challengerRank) {
                            // if the players rank on the ladder and rank on the challenge match up, then we good...
                            // console.log('Ranks match');
                        } else {
                            // but if they DONT, edit the appropriate rank and update the challenge
                            // console.log('Ranks do NOT match');
                            // console.log(`${challenge.challengerName}'s rank is ${challenge.challengerRank} but is ${player.rank} on the ladder.`);
                            challenge.challengerRank = player.rank;
                            this.updateChallenge(challenge.id, challenge);
                            // console.log('Send the following object with updates to the challenge:', challenge);
                        }
                    }
                    if (player.id === challenge.defenderId) {
                        // same thing for the defender id
                        // console.log('Match found - Defender');
                        if (player.rank === challenge.defenderRank) {
                            // console.log('Ranks match');
                        } else {
                            // console.log('Ranks do NOT match');
                            // console.log(`${challenge.defenderName}'s rank is ${challenge.defenderRank} but is ${player.rank} on the ladder.`);
                            challenge.defenderRank = player.rank;
                            this.updateChallenge(challenge.id, challenge);
                            // console.log('Send the following object with updates to the challenge:', challenge);
                        }
                    }
                });
                // unsub when we're done because we dont want this running everytime theres a database edit
                playerSub.unsubscribe();
                this._inServiceSub.unsubscribe();
                // console.log('this is how an unssub looks:', this._inServiceSub);
                if (this._inServiceSub.closed === true) {
                    // console.log('sub closed!');
                    flag = false;
                }
            });
        });
    }

    public updateChallenge(id, challenge) {
        const challengeRef = this._database.list('/x-challenges');
        challengeRef.update(id, challenge);
    }

    // method to delete a challenge. since this is called every time there a score update,
    // lets update the ranks on all the challenges post deletion
    public deleteChallenge(id) {
        this._database.list('/x-challenges').remove(id).catch(error => alert(error)).then(
            () => {
                console.log('Challenge Deleted.');
                // this.matchChallengeRank(true);
            }
        );
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
