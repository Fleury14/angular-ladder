import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';
import Player from './../../interfaces/player';

import { AngularFireList, AngularFireObject, FirebaseOperation } from 'angularfire2/database/interfaces';

import { LadderService } from './../ladder.service';

@Injectable()

export class LadderDatabaseService {

    private _tempPlayers = this._ladder.getPlayers('tekken');
    public ladderObs = this._database.list('/ladder').valueChanges();

    constructor(private _database: AngularFireDatabase, private _ladder: LadderService) {
        console.log(this._tempPlayers);
    }

    public addPlayer(game: string, player: Player) {
        return this._database.list('ladder/' + game + '/players/').push(player);
    }

    public updatePlayer(player: Player, id: string, game: string) {
        const playerRef = this._database.list('ladder/' + game + '/players/');
        playerRef.update(id, player);
    }

    public getPlayers(game: string) {

        // so in this case, we're eschewing the step of using a declared observable and .mapping straight from the .list
        return this._database.list('/ladder/' + game ).valueChanges().map(data => {
            // empty array to prevent overfills on changes
            const playerList = [];

            // create player with the id intact
            for(let playerKey in data[0] ) {
                const playerLoop = data[0][playerKey];
                playerLoop.id = playerKey;
                playerList.push(playerLoop);
            }
            // console.log('list of players from service with id:', playerList);
            return playerList;
        });
    } // end get players

    public getGameList() {
        return this._database.list('/').valueChanges().map(data => {
            const gameList = [];
            for (let game in data[0]) {
                console.log('iteration:', game, data[0][game]);
                const gameLoop = {
                    title: data[0][game].title,
                    ref: game
                };
                gameList.push(gameLoop);
            }

            return gameList;
        });
    } // end get gamelist

    public getNumOfPlayer(game) {
        return this._database.list('/ladder/' + game + '/players').valueChanges().map(data => {
            return data.length;
        })
    }

    // public instantiation() {
    //     this._tempPlayers.forEach(element => {
    //         this.addPlayer('tekken', element);
    //     });
    // }

}
