import { Component } from '@angular/core';

import Challenge from '../../interfaces/challenge';
import ChallengeDB from '../../interfaces/challenge-db';

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
    public listOfChallenges: any[];
    public newListOfGames;

    constructor( private _challengeDB: ChallengeDatabaseService, private _ladderDB: LadderDatabaseService ) {
        // for (let i = 0; i < this.myList.getLength(); i++) {
        //     this.currentList.push(this.myList.getChallenge(i));
            // console.log(this.myList.getChallenge(i));
        // }

        this._challengeDB.getListOfChallenges().subscribe(challengeList => {
            this.listOfChallenges = challengeList;
            console.log('list of challenges', this.listOfChallenges);
        });

        this._ladderDB.getGameListNew().subscribe(gameList => {
            this.newListOfGames = gameList;
        });

    }

    public challengesPerGame(game: string) {
        const specificChallengeList = [];

        this.listOfChallenges.forEach(function(challenge) {
            if (challenge.game === game) {
                specificChallengeList.push(challenge);
            }
        });

        return specificChallengeList;
    }

    public unixDateConversion(unixDate: number) {
        return new Date(unixDate);
    }

}
