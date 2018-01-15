import { Component, OnInit } from '@angular/core';

import { LadderDatabaseService } from './../../services/database/ladder-database.service';
import { LoginService } from './../../services/login.service';
import { PendingDatabaseService } from './../../services/database/pending-database.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: [ './join.component.css']
})

export class JoinComponent implements OnInit {

    public gameList; // will contain list of games on the ladder
    public selectedGame: string; // will contain game player clicked on

    // join fields
    public joinName: string;
    public joinPsnId: string;
    public joinGoogle: boolean;

    // warning flags
    public userSubmitted = false;
    public dupeWarning = false;
    public fullWarning = false;

    // instantiate list of games. also do immedite check to see if the DB is over capacity
    constructor( private _ladderDB: LadderDatabaseService, private _login: LoginService, private _pending: PendingDatabaseService,
    private _actRouter: ActivatedRoute, private _router: Router) {
        this._ladderDB.getGameList().subscribe(gameList =>
        this.gameList = gameList);
        this.fullWarning = this._pending.pendingFull(); // db check is here
    }

    ngOnInit() {
        this._actRouter.params.subscribe((params: Params) => {
            if (params.game) {
                this.selectGame(params.game);
            }
        });
    }

    // function for switching selected game from HTML
    public selectGame(game: string) {
        this.selectedGame = game;
    }

    // method for added pending request
    public addPending(game: string) {

        // make sure that the player didn't click the box without logging, and if they did, warn them
        if (this._login.afAuth.auth.currentUser === null && this.joinGoogle === true) {
            alert('You are attempting to link a google account without logging in first. Please login.');
            return;
        }

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

        // console.log('Dupe Check', this._pending.checkForDupes(game, this.joinPsnId));
        // check to see if theres a record in the pending DB that has a matching game AND psnid
        if (this._pending.checkForDupes(game, this.joinPsnId) === true) {
            // if so, adjust warning flags and do not submit
            this.dupeWarning = true;
            this.userSubmitted = false;
        } else if (this.fullWarning === true) {
            // double check to make sure we're not over capacity, if so, do not submit
            return;
        } else {
            // passed conditions, submit OK
            console.log(`Submitting the following pending:`, pendingToBeAdded);
            this._pending.addPending(pendingToBeAdded);
            // route to submission page
            this._router.navigate(['/submit', {type: 'join'}]);

            // // adjust warning flags
            // this.dupeWarning = false;
            // this.userSubmitted = true;
            // setTimeout(function() { this.userSubmitted = false; }, 3000);

            // // reset field
            // this.joinName = '';
            // this.joinPsnId = '';
            // this.selectedGame = undefined;
        } // end if

    } // end addPending
}
