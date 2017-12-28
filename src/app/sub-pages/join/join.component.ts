import { Component } from '@angular/core';

import { LadderDatabaseService } from './../../services/database/ladder-database.service';
import { LoginService } from './../../services/login.service';

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

    constructor( private _ladderDB: LadderDatabaseService, private _login: LoginService) {
        this._ladderDB.getGameList().subscribe(gameList =>
        this.gameList = gameList);
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

        console.log(`Submitting the following pending:`, pendingToBeAdded);
    }
}
