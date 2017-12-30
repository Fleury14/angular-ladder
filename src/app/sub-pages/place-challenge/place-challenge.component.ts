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

    constructor(private _ladderDB: LadderDatabaseService) {
        this._ladderDB.getGameList().subscribe(gameList => {
            // instantiate game list
            this.listOfGames = gameList;
        })
    }

    public useLinked() {
        this.challengeMethod = 1;
    }

    public useAnon() {
        this.challengeMethod = 2;
    }
}
