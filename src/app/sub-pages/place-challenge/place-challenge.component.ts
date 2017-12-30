import { Component } from '@angular/core';

import { LadderDatabaseService } from './../../services/database/ladder-database.service';

@Component({
    selector: 'app-place-challenge',
    templateUrl: './place-challenge.component.html',
    styleUrls: [ './place-challenge.component.css']
})

export class PlaceChallengeComponent {

    public challengeMethod = 0; // will contain the user selection in how to challenge someone. 1 = linked 2 = anon
    public listOfGames; // will contain list of games
    public selectedGame: string; // will contain the game the user selects
    public listOfPlayers; // will contain a list of players for selected game
    public selectedChallenger; // for anon challenges, will hold the challenger info

    // progression flags
    public canSelectPlayer = false;
    public canSelectDefender = false;

    constructor(private _ladderDB: LadderDatabaseService) {
        this._ladderDB.getGameList().subscribe(gameList => {
            // instantiate game list
            this.listOfGames = gameList;
        });
    }

    public useLinked() {
        this.challengeMethod = 1;
    }

    public useAnon() {
        this.challengeMethod = 2;
    }

    public selectGame(game: string) {
        // set selected game and instantiate player list
        this.selectedGame = game;
        this._ladderDB.getPlayers(game).subscribe(playerList => {
            this.listOfPlayers = playerList;
        });

        

        // progress to next section
        this.canSelectPlayer = true;
    }

    public selectPlayer(player) {
        // cancel select player if they have a linked google account
        if (player.google) {return; }
        this.selectedChallenger = player;
        this.canSelectDefender = true;
        this.canSelectPlayer = false;
    }
}
