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
        // console.log(this._tempPlayers);
    }

    // function to add a player to the database. requires a valid player object that follows the interface, and a game to add it to
    public addPlayer(game: string, player: Player) {
        return this._database.list('ladder/' + game + '/players/').push(player);
    }

    // function to delete a player. required game the player is in and the id of the player to be deleted. i had initiallly considered
    // calling a rerank here but i couldnt get it to work. now it calls the rerank fromm the components end.
    public deletePlayer(game: string, id: string) {
        return this._database.list('ladder/' + game + '/players').remove(id);
    }

    // method to update player called both from editing a players info and the rerank function when adjusting rank
    // requires new player object, id of the player to update and game the player is on
    // note that i ask for the entire object on the input end so that i can use this in multiple functions
    public updatePlayer(player: Player, id: string, game: string) {
        const playerRef = this._database.list('ladder/' + game + '/players/');
        // console.log(`updating ladder ${game} and player id ${id} with the following object:`, player);
        playerRef.update(id, player);
    }

    // method to get a list of players from a particular game with the id added on as another property
    // we use dunlavys roomreserve method here as well
    public getPlayers(game: string) {

        // so in this case, we're eschewing the step of using a declared observable and .mapping straight from the .list
        return this._database.list('/ladder/' + game ).valueChanges().map(data => {
            // empty array to prevent overfills on changes
            const playerList = [];

            // create player with the id intact
            for (let playerKey in data[0]) {
                const playerLoop = data[0][playerKey];
                playerLoop.id = playerKey;
                playerList.push(playerLoop);
            }
            // console.log('list of players from service with id:', playerList);
            return playerList;
        });
    } // end get players

    // method to sort the list by ascending rank. used when someone is deleted
    public sortAndRerank(game: string) {
        console.log(`sorting game ${game}...`);
        const unSortedList = this.getPlayers(game).subscribe(playerList => {
            playerList.sort(function(a, b) { return a.rank - b.rank; });

            for(let i = 0; i < playerList.length; i++) {
                if (playerList[i].rank < i + 1) {
                    // if the player rank is lower than what the next expected number is, this is most likely due
                    // to two players having the same rank. adjust rank as required:
                    console.log(`Player ${playerList[i].name} is a lower rank than expected. Setting to ${i + 1}`);
                    playerList[i].rank = i + 1;
                    this.updatePlayer(playerList[i], playerList[i].id, game);
                } else if (playerList[i].rank > i + 1) {
                    // if the player rank is higher than expected, this is usually due to a player being deleted
                    // creating a gap in the rankings. notify in console and adjust
                    console.log(`Player ${playerList[i].name} is a higher rank than expected. Setting to ${i + 1}`);
                    playerList[i].rank = i + 1;
                    // console.log(`current rank: ${playerList[i].rank}, target rank ${i + 1}`);
                    this.updatePlayer(playerList[i], playerList[i].id, game);
                } // end if.. if we're this far then that means the players rank is what it should be and no action needs to be taken
            }
        })
    }

    // gets a list of games in the ladder. returns both a .ref and .title property so the future calls to the databse from this game
    // list can use the  value of .ref a s a point of reference
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

    // returns the number of players in a current game
    public getNumOfPlayer(game) {
        return this._database.list('/ladder/' + game + '/players').valueChanges().map(data => {
            return data.length;
        });
    }

    // public instantiation() {
    //     this._tempPlayers.forEach(element => {
    //         this.addPlayer('tekken', element);
    //     });
    // }

}