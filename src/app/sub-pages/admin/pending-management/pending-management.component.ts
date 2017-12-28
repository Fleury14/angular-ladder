import { Component } from '@angular/core';

import Player from './../../../interfaces/player';

import { PendingDatabaseService } from './../../../services/database/pending-database.service';
import { LadderDatabaseService } from './../../../services/database/ladder-database.service';

@Component({
    selector: 'app-admin-pending',
    templateUrl: './pending-management.component.html',
    styleUrls: [ './pending-management.component.css']
})

export class PendingManagementComponent {

    public pendingList; // will contain list of pending apps
    public listOfGames; // will contain list of games

    // instantiate list of games (now with length!) and list of applicants with ids
    constructor(private _pending: PendingDatabaseService, private _ladderDB: LadderDatabaseService) {
        this._pending.getListOfPending().map(gameList => {
            // use dunlavy RR tech to put key in object
            const pendingList = [];
            for (const pendKey in gameList[0]) {
                const pendLoop = gameList[0][pendKey];
                pendLoop.id = pendKey;
                pendingList.push(pendLoop);
            }
            return pendingList;
        })
        .subscribe(gameList => {
            this.pendingList = gameList;
            console.log(this.pendingList);
        });

        // this time we use a nested subscribe to add the length of players from the ladder database as a property
        // on to our list of games. this is necessary when calculating rank for new players
        this._ladderDB.getGameList().subscribe(gameList => {
            this.listOfGames = gameList;
            this.listOfGames.forEach( game => {
                this._ladderDB.getNumOfPlayer(game.ref).subscribe( result => {
                    game['playerLength'] = result;
                });
            });
            // console.log(`list of games... with length??`, this.listOfGames);
        });
    }

    // deny application button. simple database delete call
    public denyPending(id) {
        if (confirm('Are you sure you want to deny this app? This will delete it from the database.')) {
            this._pending.deletePending(id);
        }
    }

    // approve application. adds the player to the respective ladder then deletes the application from the database
    public approvePending(id: string) {
        if (confirm('Approving this app will delete it from the pending list and add to the bottom of the ladder.')) {
            // use .find to grab the correct pending app and put it into fromList
            const fromList = this.pendingList.find(function(element, index, array) {
                if (element.id === id) { return array[index]; }
            });
            // also use .find to grab the game that matches the applicants game. this way we can
            // call the .length propert to figure their starting rank
            const targetGame = this.listOfGames.find(function(element, index, array) {
                if ( element.ref === fromList.game) { return array[index]; }
            });
            // assign starting values
            const playerToBeAdded: Player = {
                name: fromList.name,
                psnId: fromList.psnId,
                wins: 0,
                losses: 0,
                elo: 1500,
                streak: 'None',
                rank: targetGame.playerLength + 1,
                google: fromList.google
            };
            console.log(`player to be added`, playerToBeAdded);

            // add to ladder, remove from pending
            this._ladderDB.addPlayer(fromList.game, playerToBeAdded);
            this._pending.deletePending(id);

        }
    }
}
