import { Component } from '@angular/core';

import Challenge from '../../interfaces/challenge';

// import { ChallengeListService } from '../../services/challenge-list.service';
import { ChallengeDatabaseService } from '../../services/database/challenge-database.service';
import { LadderDatabaseService } from '../../services/database/ladder-database.service';


@Component({
    selector: 'app-challenge',
    templateUrl: './challenge.component.html',
    styleUrls: ['./challenge.component.css']
})

export class ChallengeComponent {
    // public myList = new ChallengeList;
    // public currentList = [];
    public listOfGames;
    public listOfChallenges;

    constructor( private _challengeDB: ChallengeDatabaseService, private _ladderDB: LadderDatabaseService ) {
        // for (let i = 0; i < this.myList.getLength(); i++) {
        //     this.currentList.push(this.myList.getChallenge(i));
            // console.log(this.myList.getChallenge(i));
        // }

        this._ladderDB.getGameList().subscribe(gameList => {
            this.listOfGames = gameList;
            // this.listOfGames.forEach(game => {this.listOfChallenges[game.ref] = []; });
            // console.log('empty challenge array:', this.listOfChallenges);
            console.log('list of games?', this.listOfGames);
        });

        this._challengeDB.getListOfChallenges().subscribe(challengeList => {
            this.listOfChallenges = challengeList;
            console.log('list of challenges', this.listOfChallenges);
        });
    
    }



}
