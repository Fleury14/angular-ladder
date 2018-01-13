import { Component, OnInit } from '@angular/core';

import { PendingDatabaseService } from './../../../services/database/pending-database.service';
import { ChallengeDatabaseService } from './../../../services/database/challenge-database.service';
import { LadderDatabaseService } from './../../../services/database/ladder-database.service';
import { MatchHistoryDatabaseService } from './../../../services/database/match-history-database.service';

@Component({
    selector: 'app-admin-news',
    templateUrl: './challenge-management.component.html',
    styleUrls: [ './challenge-management.component.css' ]
})

export class ChallengeManagementComponent implements OnInit {

    public listOfPendingChallenges; // will contain a list of anon chasllenges that are pending
    public listOfActiveChallenges; // will conatin a list of active challenges
    public listOfResults; // will contain list of results
    public listOfAffectedPlayers; // will container players on a ladder whos rank will change
    private _currentDefender; // will contain the player which is defending a challenge for purpose of result posting
    private _postButtonClicked = false; // flag to make sure post button was clicked. more explanation on result posting function
    public editScore = false; // is the user editing score?
    public selectedChallenge;
    private _CHALLENGETIME = 604800000; // how long a challenge has to be completed after approval, in milliseconds
    private _MAXCHALLENGERANK = 5; // the number of spots a player can challenge above.

    // ngmodel fields
    public challengerScoreInput: string;
    public defenderScoreInput: string;

    ngOnInit() {
        this._pending.getListOfPendingChallenges().subscribe(pendingList => {
            this.listOfPendingChallenges = pendingList;
            // onsole.log('list of pendings:', this.listOfPendingChallenges);
        });

        this._challengeDB.getListOfChallenges().subscribe(challengeList => {
            this.listOfActiveChallenges = challengeList;
            // console.log('list of actives:', this.listOfActiveChallenges);
        });

        this._pending.getListOfResults().subscribe(resultList => {
            this.listOfResults = resultList;
        });
    }

    constructor (private _pending: PendingDatabaseService, private _challengeDB: ChallengeDatabaseService,
        private _ladderDB: LadderDatabaseService, private _matchDB: MatchHistoryDatabaseService) {

    }

    // method to deny challenge. deletes it from the pending list
    public denyChallenge(id) {
        this._pending.deletePendingChallenge(id);
    }

    // method to approve challenge. deletes it from the pending list and adds to active challenges
    public approveChallenge(challenge, id) {
        if (confirm('Confirm adding selected challenge to official challenge list')) {
            // add 10 days in ubnix time to the current date to pass correct deadling
            challenge['deadline'] = Date.now() + this._CHALLENGETIME;
            this._pending.deletePendingChallenge(id);
            challenge.id = null; // remove the challenge id from the pending list so that its not confused with the id in the challenge list
            console.log('submitting challenge:', challenge);
            this._challengeDB.addChallenge(challenge);

        }

    }

    // method to delete an active challenge from the database
    public deleteActiveChallenge(id) {
        if (confirm('Are you sure you want to delete this challenge?')) {
            this._challengeDB.deleteChallenge(id);
        }
    }

    // method to delete a result
    public deleteResult(id) {
        if (confirm('Are you sure you want to delete this result?')) {
            this._pending.deleteResult(id);
        }
    }

    // method to allow input of a score
    public addScore(challenge) {
        // run the challenge match here to ensure that the ranks are up to date
        this._challengeDB.matchChallengeRank();
        this.editScore = true;
        this.selectedChallenge = challenge;
    }

    public submitScore() {
        if (confirm('Are you sure you want to submit this score? This will not erase the challenge from the DB.')) {
            this.selectedChallenge['challengerScore'] = this.challengerScoreInput;
            this.selectedChallenge['defenderScore'] = this.defenderScoreInput;
            this.selectedChallenge['challengeDBId'] = this.selectedChallenge.id;
            this.selectedChallenge.id = null;
            this._pending.addResult(this.selectedChallenge);
            this.editScore = false;
        }

    }

    // method to approve result. note that because we are using a subscription to valuechanges, this will run EACH TIME
    // an edit is made on a player. in order to prevent that, we want to make sure that it runs only once, and only when
    // the button on the page is clicked. because the only code thats executes is inside the subscription {}, we use a 
    // boolean flag outside of it as a conditional
    public approveResult(result) {
        if (confirm('Are you sure you want to approve this result? This will update results, remove the pending result and the challenge from the DB.')) {
            this._postButtonClicked = true; // the aforementioned flag
            this.listOfAffectedPlayers = []; // list of all players whos rank will be lowered
            this._currentDefender = null; // the current defender.
            // NOTE: The reason the current defender is seperate is because its possible that the defender has a higher than 3 rank difference
            // if they won their own challenge. as a result, any adjustments to rank to the defender only will be done in this object.
            // when it comes time to update, we will make sure that the same person does not get pushed twice
            this._ladderDB.getPlayers(result.game).subscribe(playerList => {

                // make sure we're coming from the challenge management page with this flag check
                if (this._postButtonClicked === true) {

                    // find the appropriate player and assign him as the defender
                    this._currentDefender = playerList.find(function(e, i, a) {
                        if (e.id === result.defenderId) { return true; }
                    });
                    // check to see if the defenders rank is more than the allowed 5 spot move up. this can happen if
                    // someone was challenged, but before completing the defending challenged, completed their own attacking
                    // challenge and moved up. if the rank difference is fine, stick to the current method of grabbing players
                    if (result.challengerRank - result.defenderRank <= this._MAXCHALLENGERANK) {
                        // grab all players affected by the challenge. note that because we are getting players from a sorted array,
                        // it starts at index 0, not 1. this is why we go from defender rank - 1 to challenger rank - 1:
                        // in the array, first place is index 0, not index 1
                        for (let rank = result.defenderRank - 1; rank < result.challengerRank; rank++ ) {
                            this.listOfAffectedPlayers.push(playerList[rank]);
                        }
                    } else {
                        // if its not, then grab the 5 affected players above the challenger including the challenger
                        // note that we start at max challenge - 1 to account for the array starting at 0
                        for (let rank = result.challengerRank - this._MAXCHALLENGERANK - 1; rank < result.challengerRank; rank++ ) {
                            this.listOfAffectedPlayers.push(playerList[rank]);
                        }
                    }

                    console.log('affected players:', this.listOfAffectedPlayers);
                    console.log('current defender', this._currentDefender);
                    const lastIndex = this.listOfAffectedPlayers.length - 1;
                    this.listOfAffectedPlayers[lastIndex].recentOpponent = result.defenderId;
                    if (result.challengerScore > result.defenderScore) {
                        this._winAdjust(result, lastIndex);
                    }
                    if (result.challengerScore < result.defenderScore) {
                        this._lossAdjust(result, lastIndex);
                    }
                    if (result.challengerScore === result.defenderScore) {
                        console.log('ERROR: I dont know what to do with a tie :(');
                    }
                } // end flag check
            }); // end subscribe
        } // end confirm() if
    }

    // method to make player adjustments based off a challenger win
    private _winAdjust(result, chall) {

        // increment all affected players rank by 1
        this.listOfAffectedPlayers.forEach(player => {
            console.log('hunch: incrementing affected players rank');
            player.rank++;
        });
        // then readjust challengers rank based on the challenge data
        this.listOfAffectedPlayers[chall].rank = result.defenderRank;

        // adjust wins and losses
        this._currentDefender.losses++;
        this.listOfAffectedPlayers[chall].wins++;

        // adjust streak
        this._currentDefender.streak = this._streakUpdate(this._currentDefender.streak, 0);
        this.listOfAffectedPlayers[chall].streak = this._streakUpdate(this.listOfAffectedPlayers[chall].streak, 1);

        // adjust ELO
        const challELO = this.listOfAffectedPlayers[chall].elo;
        const defELO = this._currentDefender.elo;
        this.listOfAffectedPlayers[chall].elo = this._getNewRating(challELO, defELO, 1);
        this._currentDefender.elo = this._getNewRating(defELO, challELO, 0);

        // make sure defender isnt included in both affectedPlayers and currentDefender
        // if current defender is actually in the afectedPlayers list, he should always be first so a simple shift() should work
        if (this._currentDefender.id === this.listOfAffectedPlayers[0].id) {
            // console.log('shifting selected players. oldlist', this.listOfAffectedPlayers);
            this.listOfAffectedPlayers.shift();
            // console.log('new list', this.listOfAffectedPlayers);
        }

        console.log('post win defender adjustments', this.listOfAffectedPlayers, this._currentDefender);
        // finally, push adjustments to db

        // update defender and delete challenge and result from database. also reset the clicked button flag
        this._ladderDB.challengerWinPost(this.listOfAffectedPlayers, this._currentDefender, result);
        // set current date in unix and push to match history
        result.dateCompleted = Date.now();

        this._matchDB.addMatch(result);
        this._challengeDB.deleteChallenge(result.challengeDBId);
        this._pending.deleteResult(result.id);
        // run a check on the challenge database to adjust the ranks of any players who might have moved
        this._challengeDB.matchChallengeRank();
        this._postButtonClicked = false;
}

    // method to make player adjustments based off a defender win
    private _lossAdjust(result, chall) {
        // the last player in the list of affected players should always be the challenger.
        // in the event of a defender win, that's all we're interested in since no ranks will be moved
        // const chall = this.listOfAffectedPlayers.length() - 1;

        // add wins and losses
        this._currentDefender.wins++;
        this.listOfAffectedPlayers[chall].losses++;
        // adjust elo
        const challELO = this.listOfAffectedPlayers[chall].elo;
        const defELO = this._currentDefender.elo;
        this.listOfAffectedPlayers[chall].elo = this._getNewRating(challELO, defELO, 0);
        this._currentDefender.elo = this._getNewRating(defELO, challELO, 1);

        // adjust streak
        this._currentDefender.streak = this._streakUpdate(this._currentDefender.streak, 1);
        this.listOfAffectedPlayers[chall].streak = this._streakUpdate(this.listOfAffectedPlayers[chall].streak, 0);

        // if the challenger rank is #2, force them to wait a couple days to place another challenge so that they can't
        // constantly have a lock on the title shot. we'll give them 3 days, 259200000 seconds
        if (this.listOfAffectedPlayers[chall].rank === 2) {
            this.listOfAffectedPlayers.champWait = Date.now() + 259200000;
        }

        // console.log('post defender win adjustments', this._currentDefender, this.listOfAffectedPlayers[chall]);
        // update results
        this._ladderDB.defenderWinPost(this.listOfAffectedPlayers[chall], this._currentDefender, result);
        // set current date in unix and push to match history
        result.dateCompleted = Date.now();
        this._matchDB.addMatch(result);
        // remove result and challenge from database
        this._challengeDB.deleteChallenge(result.challengeDBId);
        this._pending.deleteResult(result.id);
        // run a check on the challenge database to adjust the ranks of any players who might have moved
        this._challengeDB.matchChallengeRank();
        this._postButtonClicked = false;
    }

    // ELO functions from github: moroshko
    private _getRatingDelta(myRating, opponentRating, myGameResult) {
        if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
          return null;
        }

        const myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));

        return Math.round(32 * (myGameResult - myChanceToWin));
    }
    private _getNewRating(myRating, opponentRating, myGameResult) {
        return myRating + this._getRatingDelta(myRating, opponentRating, myGameResult);
    }

    public unixConvert(unix: number): Date {
        return new Date(unix);
    }

    // method to update a players streak field. takes a string of the old stream and a number denoting result
    // 0 == loss, 1 = win
    private _streakUpdate(oldStreak: string, result: number): string {
        // console.log('running streak adjust with following arguments', oldStreak, result);
        let resultStreak = '';
        // if the result is a win...
        if (result === 1) {

            // check to see if the current streak is a win
            if (oldStreak.charAt(0) === 'W') {
                // if so find the space in the string
                const space = oldStreak.search(' ');
                // grab everything in the result after the space
                const oldNum = oldStreak.substr(space + 1);
                // increment it
                const newNum = parseInt(oldNum, 10) + 1;
                // create a new streak with an incremented number
                resultStreak = 'Won '.concat(newNum.toString());
            } else if (oldStreak.charAt(0) === 'L' || oldStreak.charAt(0) === 'N') {
                // if previous streak is a loss, reset to one win
                resultStreak = 'Won 1';
            } else {
                console.log('Error, invalid original streak');
            }
        } else if (result === 0 ) {
            // loss would be the inverse of the win effect
            // check to see if the current streak is a win
            if (oldStreak.charAt(0) === 'L') {
                // if so find the space in the string
                const space = oldStreak.search(' ');
                // grab everything in the result after the space
                const oldNum = oldStreak.substr(space + 1);
                // increment it
                const newNum = parseInt(oldNum, 10) + 1;
                // create a new streak with an incremented number
                resultStreak = 'Lost '.concat(newNum.toString());
            } else if (oldStreak.charAt(0) === 'W' || oldStreak.charAt(0) === 'N') {
                // if previous streak is a loss, reset to one win
                resultStreak = 'Lost 1';
            } else {
                console.log('Error, invalid original streak');
            }
        } else {
            console.log('invalid number in result argument, should be 1 or 0');
        }
        return resultStreak;
    }

    // method to force a rank update on challenges
    // use this if the ranks on the challenge do not match the ranks on the ladder due to player movement
    public matchRank() {
        this._challengeDB.matchChallengeRank();
    }

}
