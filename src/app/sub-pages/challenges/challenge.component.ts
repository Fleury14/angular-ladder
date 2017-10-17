import { Component } from '@angular/core';

import Challenge from '../../interfaces/challenge';

import { ChallengeListService } from '../../services/challenge-list.service';


@Component({
    selector: 'app-challenge',
    templateUrl: './challenge.component.html',
    styleUrls: ['./challenge.component.css']
})

export class ChallengeComponent {
    // public myList = new ChallengeList;
    public currentList = [];

    constructor( public myList: ChallengeListService ) {
        for (let i = 0; i < this.myList.getLength(); i++) {
            this.currentList.push(this.myList.getChallenge(i));
            // console.log(this.myList.getChallenge(i));
        }
    }



}
