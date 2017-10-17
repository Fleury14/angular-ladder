import { Injectable } from '@angular/core';

import Challenge from './../interfaces/challenge';

@Injectable()

export class ChallengeListService {
    private list: Challenge[];

        private buildList() {
            this.list.push({
                challengeeRank: 1,
                challengerRank: 2,
                challengeeName: 'jr',
                challengerName: 'rado',
                game: 'marvel',
                deadline: '10/4'
            });
        }

        constructor() {
            this.list = [];
            this.buildList();
            console.log('Challenge array built!');
        }

        public getLength() {
            return this.list.length;
        }

        public getChallenge(iteration: number) {
            return this.list[iteration];
        }
}
