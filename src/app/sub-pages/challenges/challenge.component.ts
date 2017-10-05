import { Component } from '@angular/core';

import Challenge from '../../interfaces/challenge';
import ChallengeList from '../../classes/challengeList';


@Component({
    selector: 'app-challenge',
    templateUrl: './challenge.component.html',
    styleUrls: ['./challenge.component.css']
})

export class ChallengeComponent {
    public myList = new ChallengeList;
    private currentList = [];

    constructor() {
        for (let i = 0; i < this.myList.getLength(); i++) {
            this.currentList.push(this.myList.getChallenge(i));
            // console.log(this.myList.getChallenge(i));
        }
    }



}
