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

    // instantiate list of pending applications
    constructor( private _database: AngularFireDatabase ) {
        this._database.list('/w-pending/join').valueChanges().subscribe(pendingList => {
            this._listOfPending = pendingList;
        });

        this._database.list('/w-pending/link').valueChanges().subscribe(listOfLinks => {
            this._listOfPendingLinks = listOfLinks;
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

    // take in an object and add it to the pending database
    public addPending(pending) {
        this._database.list('/w-pending/join').push(pending);
    }

    // take in an id and delete the application with that id from the database
    public deletePending(id) {
        this._database.list('/w-pending/join').remove(id);
    }

    public addPendingLink(link) {
        this._database.list('/w-pending/link').push(link);
    }

    public dupeLinkCheck(game: string, id: string) {

        let dupeCheck = false; // reset to false each call

        // go through each item of the list and see if the psn id's and game both match
        // if so, set the flag to true
        this._listOfPendingLinks.forEach(link => {
            // console.log(`Checking incoming ${psnId} vs iteration ${pending.psnId}`);
            if (link.game === game && link.id === id) {
                dupeCheck = true;
            }
        });

        return dupeCheck;
    }
}
