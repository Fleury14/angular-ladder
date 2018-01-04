import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { LadderDatabaseService } from './../../../services/database/ladder-database.service';

import Player from './../../../interfaces/player';

@Component({
    selector: 'app-admin-players',
    templateUrl: './player-management.component.html',
    styleUrls: [ './player-management.component.css']
})

export class PlayerManagementComponent implements OnInit {

    public listOfPlayers; // will hold player list for selected game
    public selectedPlayer; // player that was selected by user from list
    public gameList; // list of all games in the ladder
    public currentGame = {  // initial placeholder for current game
        title: '',
        ref: '',
        numOfPlayers: 0
    };

    // add player stuffs
    public canAddPlayers = false;
    public playerToBeAdded: Player;
    public nameField: string;
    public psnField: string;

    // update player stuffs
    public canEditPlayer = false;
    @ViewChild('playerUpdateForm')
    private _playerUpdateForm: NgForm;
    private _oldRank: number;
    public updateNameField: string;
    public updatePsnIdField: string;
    public updateRankField: number;
    public updateWinsField: number;
    public updateLossesField: number;
    public updateEloField: number;
    public updateStreakField: string;

    constructor(private _ladderDB: LadderDatabaseService) {
        // instantiate the game list first so that game list and subsequent player list can be built dynamically
        this._ladderDB.getGameList().subscribe(data => {
            this.gameList = data;
        });
    }

    ngOnInit() {
        this.currentGame.ref = 'placeholder';
    }

    // method for displaying info on the right half of the screen when the user click on a player from the player list
    // simply retrieves the player object that has a matching id
    public displayPlayerInfo(id) {
       this.selectedPlayer = this.listOfPlayers.find(player => player.id === id);
       // console.log(this.selectedPlayer);
    }

    // method for when the user clicks on a game from the list of game. takes in both the title of the game and the name of the game in
    // the database as a .ref. switches the currentGame attributes, then repopulates the player list according to the game selected
    public switchGame(ref, title) {
        this.currentGame.ref = ref;
        this.currentGame.title = title;

        // the total number of players in a ladder is used when adding a player
        this._ladderDB.getNumOfPlayer(ref).subscribe(result => {
            this.currentGame.numOfPlayers = result;
        });
        this._ladderDB.getPlayers(this.currentGame.ref).subscribe(result => {
            this.listOfPlayers = result;
        });
    }

    // methods for allovwing and disallowing the user to have access to the add player div. this should eventually be refactored into its
    // own child component 
    public openAddPlayer() {
        this.canAddPlayers = true;
    }

    public cancelAddPlayer() {
        this.canAddPlayers = false;
    }

    // method for adding a player to the database
    public addPlayer() {

        // create the object so that it matches the Player interface
        // also note that this uses the total number of players to automatically set the new players rank
        // at the bottom
        this.playerToBeAdded = {
            name: this.nameField,
            psnId: this.psnField,
            wins: 0,
            losses: 0,
            elo: 1500,
            streak: 'None',
            rank: this.currentGame.numOfPlayers + 1
        };

        // console.log('player to be added: ', this.playerToBeAdded);

        // call the service function
        this._ladderDB.addPlayer(this.currentGame.ref, this.playerToBeAdded);
        // then reset the fields and hide the add player so they cant spam the button and add a bajillion players
        this.canAddPlayers = false;
        this.nameField = '';
        this.psnField = '';
    }

    // method for opening the edit player functionality
    public allowUpdatePlayer() {
        this.canEditPlayer = true;

        // document.getElementById('background-shader-box').style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

        // fill in the fields with the corresponding values from the player object. tbh there should be a cleaner way to do this
        this.updateNameField = this.selectedPlayer.name;
        this.updatePsnIdField = this.selectedPlayer.psnId;
        this.updateWinsField = this.selectedPlayer.wins;
        this.updateLossesField = this.selectedPlayer.losses;
        this.updateStreakField = this.selectedPlayer.streak;
        this.updateEloField = this.selectedPlayer.elo;
        this.updateRankField = this.selectedPlayer.rank;
    }

    // method to hide the edit player box. doesn't reset the fields since you can't see them and any reappearance of the fields
    // would trigger an update anyway
    public cancelUpdatePlayer() {
        this.canEditPlayer = false;

    }

    // method to update a players info.
    public updatePlayer(value, id) {
        console.log('Updating with the following info', value);
        const updatedInfo: Player = {
            name: value.updateNameField,
            psnId: value.updatePsnIdField,
            wins: value.updateWinsField,
            losses: value.updateLossesField,
            elo: value.updateEloField,
            streak: value.updateStreakField,
            rank: value.updateRankField
        };
        this._ladderDB.updatePlayer(updatedInfo, id, this.currentGame.ref);
        // after the update call, hide the edit player field if its shown, then remove any selected player.
        this.cancelUpdatePlayer();
        this.selectedPlayer = null;

    }

    // method to delete a player. note that we're not bringing in any values from the html, because you can only click the delete
    // button in a player after selecting them first. therefore, all the data we need is in selectedPlayer
    public deletePlayer() {
        if (confirm(`Do you really want to delete ${this.selectedPlayer.name}?`)) {
            this._ladderDB.deletePlayer(this.currentGame.ref, this.selectedPlayer.id)
            .then(() => {this._ladderDB.sortAndRerank(this.currentGame.ref); });
        }
    }

    // public initialize() {
    //     this._ladderDB.instantiation();
    // }
}
