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

    public listOfPlayers;
    public selectedPlayer;
    public gameList;
    public currentGame = {
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
        this._ladderDB.getGameList().subscribe(data => {
            this.gameList = data;
        });
    }

    ngOnInit() {
        this.currentGame.ref = 'placeholder';
        // this._ladderDB.getPlayers('tekken').subscribe(data => {
        //     this.tekkenPlayers = data;
        // });
    }

    public displayPlayerInfo(id) {
       this.selectedPlayer = this.listOfPlayers.find(player => player.id === id);
       console.log(this.selectedPlayer);
    }

    public switchGame(ref, title) {
        this.currentGame.ref = ref;
        this.currentGame.title = title;
        this._ladderDB.getNumOfPlayer(ref).subscribe(result => {
            this.currentGame.numOfPlayers = result;
        });
        this._ladderDB.getPlayers(this.currentGame.ref).subscribe(result => {
            this.listOfPlayers = result;
        });
    }

    public openAddPlayer() {
        this.canAddPlayers = true;
    }

    public cancelAddPlayer() {
        this.canAddPlayers = false;
    }

    public addPlayer() {


        this.playerToBeAdded = {
            name: this.nameField,
            psnId: this.psnField,
            wins: 0,
            losses: 0,
            elo: 1500,
            streak: 'None',
            rank: this.currentGame.numOfPlayers + 1
        };

        console.log('player to be added: ', this.playerToBeAdded);
        this._ladderDB.addPlayer(this.currentGame.ref, this.playerToBeAdded);
        this.nameField = '';
        this.psnField = '';
    }

    public allowUpdatePlayer() {
        this.canEditPlayer = true;
        this.updateNameField = this.selectedPlayer.name;
        this.updatePsnIdField = this.selectedPlayer.psnId;
        this.updateWinsField = this.selectedPlayer.wins;
        this.updateLossesField = this.selectedPlayer.losses;
        this.updateStreakField = this.selectedPlayer.streak;
        this.updateEloField = this.selectedPlayer.elo;
        this.updateRankField = this.selectedPlayer.rank;
        // this._playerUpdateForm.value.updateNameField = 'LOLOL';
    }

    public cancelUpdatePlayer() {
        this.canEditPlayer = false;
    }

    public updatePlayer(value) {
        console.log('Updating with the following info', value);
        console.log('room form val', this._playerUpdateForm);
    }

    // public initialize() {
    //     this._ladderDB.instantiation();
    // }
}
