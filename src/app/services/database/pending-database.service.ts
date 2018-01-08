import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';

import NewsItem from './../../interfaces/news-item';
import { AngularFireList, AngularFireObject, FirebaseOperation } from 'angularfire2/database/interfaces';

@Injectable()

export class PendingDatabaseService {

    private _listOfPending;
    private _MAXPENDING = 30; // maximum number of pending entries
    private _listOfPendingLinks;
    private _listOfResults;

    // instantiate list of pending applications
    constructor( private _database: AngularFireDatabase ) {
        this._database.list('/w-pending/join').valueChanges().subscribe(pendingList => {
            this._listOfPending = pendingList;
        });

        this._database.list('/w-pending/link').valueChanges().subscribe(listOfLinks => {
            this._listOfPendingLinks = listOfLinks;
        });

        this._database.list('/w-pending/result').valueChanges().subscribe(resultList => {
            this._listOfResults = resultList;
        });
    }

    // method to check for duplicate entries
    // right now, the condition is just matching psnId's within the same game
    public checkForDupes(game: string, psnId: string) {

        let dupeCheck = false; // reset to false each call

        // go through each item of the list and see if the psn id's and game both match
        // if so, set the flag to true
        this._listOfPending.forEach(pending => {
            // console.log(`Checking incoming ${psnId} vs iteration ${pending.psnId}`);
            if (pending.psnId === psnId && pending.game === game) {
                dupeCheck = true;
            }
        });

        return dupeCheck;
    }

    // method to make sure the database isnt going over the maximum entries. returns T/F
    // since basically anyone can now add to the database via the pending apps, we have to put a limit so google doesnt
    // end up with a million entries and hates me forever
    public pendingFull() {
        if (this._listOfPending >= this._MAXPENDING) {
            return true;
        } else {
            return false;
        }
    }

    // get a list of pending applicants. mapping is handled on the component level
    public getListOfPending() {
        return this._database.list('/w-pending/').valueChanges();
    }

    // new list of pending link requests using snapshot changes to get key
    public getListOfPendingLinks() {
        return this._database.list('/w-pending/link').snapshotChanges().map(data => {
            const linkList = [];
            data.forEach(entry => {
                const linkLoop = entry.payload.val();
                linkLoop.id = entry.key;
                linkList.push(linkLoop);
            });
            return linkList;
        });
    }

    // get number of join request
    public getNumOfJoin() {
        return this._database.list('/w-pending/join').valueChanges().map(joins => {
            return joins.length;
        });
    }

    // take in an object and add it to the pending database
    public addPending(pending) {
        this._database.list('/w-pending/join').push(pending);
    }

    // take in an id and delete the application with that id from the database
    public deletePending(id) {
        this._database.list('/w-pending/join').remove(id);
    }

    // method to add a pending link request
    public addPendingLink(link) {
        this._database.list('/w-pending/link').push(link);
    }

    // method to delete a pending link request
    public deletePendingLink(id) {
        console.log('removing link request with id', id);
        this._database.list('/w-pending/link').remove(id);
    }

    // get number of link requests
    public getNumOfLinks() {
        return this._database.list('/w-pending/link').valueChanges().map(links => {
            return links.length;
        });
    }

    // method to make sure a duplicate link request isnt being sent. returns t/f
    public dupeLinkCheck(game: string, id: string) {

        let dupeCheck = false; // reset to false each call

        // go through each item of the list and see if the psn id's and game both match
        // if so, set the flag to true
        this._listOfPendingLinks.forEach(link => {
            console.log(`Checking incoming ${id} vs iteration ${link.playerId}`);
            if (link.game === game && link.playerId === id) {
                dupeCheck = true;
            }
        });

        return dupeCheck;
    }

    // method to get a list of all pending challenges from the DB. uses snapshotChanges to grab keys.
    // this also alleviates the need for a numerical index when storing records, which also solves a lot of bugs
    public getListOfPendingChallenges() {
        return this._database.list('/w-pending/new-challenge').valueChanges().map(pendingList => {
            const listOfKeys = [];
            this._database.list('/w-pending/new-challenge').snapshotChanges().subscribe(snapshotList => {
                snapshotList.forEach(function(snapshot) {
                    listOfKeys.push(snapshot.key);
                });
                pendingList.forEach(function(pendingItem, index) {pendingList[index]['id'] = listOfKeys[index]; });
            });
            return pendingList;
        });
    }

    // method to add an anonymouse challenge for approval
    public addPendingChallenge(challenge) {
        this._database.list('/w-pending/new-challenge').push(challenge);
    }

    // method to delete an anonymouse challenge from DB
    public deletePendingChallenge(id) {
        this._database.list('/w-pending/new-challenge').remove(id);
    }

    public getNumOfChallenges() {
        return this._database.list('/w-pending/new-challenge').valueChanges().map(challenges => {
            return challenges.length;
        });
    }

    // method to add a challenge result for approval
    public addResult(result) {
        this._database.list('/w-pending/result').push(result);
    }

    // method to delete a challenge result for approval
    public deleteResult(id: string) {
        this._database.list('/w-pending/result').remove(id);
    }

    public getNumOfResults() {
        return this._database.list('/w-pending/result').valueChanges().map(results => {
            return results.length;
        });
    }

    // method to get a list of all pending result postings
    public getListOfResults() {
        return this._database.list('/w-pending/result').valueChanges().map(pendingList => {
            const listOfKeys = [];
            this._database.list('/w-pending/result').snapshotChanges().subscribe(snapshotList => {
                snapshotList.forEach(function(snapshot) {
                    listOfKeys.push(snapshot.key);
                });
                pendingList.forEach(function(pendingItem, index) {pendingList[index]['id'] = listOfKeys[index]; });
            });
            return pendingList;
        });
    }

    // method to make sure a duplicate result isnt being posted for the same challenge
    public dupeResultCheck(id: string) {
        let dupeCheck = false; // reset to false each call
        // go through each item of the list and see if the psn id's and game both match
        // if so, set the flag to true
        this._listOfResults.forEach(result => {
            console.log(`Checking incoming ${id} vs iteration ${result.challengeDBId}`);
            if (result.challengeDBId === id) {
                dupeCheck = true;
            }
        });
        return dupeCheck;
    }
}
