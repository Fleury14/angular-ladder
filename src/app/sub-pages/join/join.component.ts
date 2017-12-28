import { Component } from '@angular/core';

import { LadderDatabaseService } from './../../services/database/ladder-database.service';
import { LoginService } from './../../services/login.service';
import { PendingDatabaseService } from './../../services/database/pending-database.service';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: [ './join.component.css']
})

export class JoinComponent {

    public gameList; // will contain list of games on the ladder
    public selectedGame: string; // will contain game player clicked on

    // join fields
    public joinName: string;
    public joinPsnId: string;
    public joinGoogle: boolean;

    public userSubmitted = false;
    public dupeWarning = false;
    public fullWarning = false;

    constructor( private _ladderDB: LadderDatabaseService, private _login: LoginService, private _pending: PendingDatabaseService) {
        this._ladderDB.getGameList().subscribe(gameList =>
        this.gameList = gameList);
        this.fullWarning = this._pending.pendingFull();
    }

    public selectGame(game: string) {
        this.selectedGame = game;
    }

    // method for added pending request
    public addPending(game: string) {

        // create the object to be pushed
        const pendingToBeAdded = {
            name: this.joinName,
            psnId: this.joinPsnId,
            game: game,
            google: ''
        };

        // if they agreed, add their google id for future use
        if (this.joinGoogle === true) {
            pendingToBeAdded.google = this._login.afAuth.auth.currentUser.uid;
        }

        console.log('Dupe Check', this._pending.checkForDupes(game, this.joinPsnId));
        if (this._pending.checkForDupes(game, this.joinPsnId) === true) {
            this.dupeWarning = true;
            this.userSubmitted = false;
        } else if (this.fullWarning === true) {
            return;
        } else {
            console.log(`Submitting the following pending:`, pendingToBeAdded);
            // this._pending.addPending(pendingToBeAdded);
            this.dupeWarning = false;
            this.userSubmitted = true;
            setTimeout(function() { this.userSubmitted = false; }, 3000);
            this.joinName = '';
            this.joinPsnId = '';
            this.selectedGame = undefined;
        } // end if

    } // end addPending
}
