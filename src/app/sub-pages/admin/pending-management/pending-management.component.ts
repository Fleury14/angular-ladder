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

    constructor(private _pending: PendingDatabaseService, private _ladderDB: LadderDatabaseService) {
        this._pending.getListOfPending().map(gameList => {
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

    public denyPending(id) {
        if (confirm('Are you sure you want to deny this app? This will delete it from the database.')) {
            this._pending.deletePending(id);
        }
    }

    public approvePending(id: string) {
        if (confirm('Approving this app will delete it from the pending list and add to the bottom of the ladder.')) {
            // console.log(`id taken in is ${id}`);
            const fromList = this.pendingList.find(function(element, index, array) {
                if (element.id === id) { return array[index]; }
            });
            // console.log(`result of find:`, fromList);
            const targetGame = this.listOfGames.find(function(element, index, array) {
                if ( element.ref === fromList.game) { return array[index]; }
            });
            // console.log('target game', targetGame);
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
            this._ladderDB.addPlayer(fromList.game, playerToBeAdded);
            this._pending.deletePending(id);

        }
    }
}
