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

    public getPlayers(game: string) {
        return this.ladderObs.map(data => {
            const playerList = [];

            for(let playerKey in data[game].players ) {
                const playerLoop = data[game].players.playerKey;
                playerLoop.id = playerKey;
                playerList.push(playerLoop);
            }

            return playerList;
        });
    } // end get players

    // public instantiation() {
    //     this._tempPlayers.forEach(element => {
    //         this.addPlayer('tekken', element);
    //     });
    // }

}
