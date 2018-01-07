import { Component } from '@angular/core';

import { LoginService } from './../services/login.service';
import { LadderDatabaseService } from './../services/database/ladder-database.service';
import { ChallengeDatabaseService } from './../services/database/challenge-database.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})

export class NavComponent {

    private _adminList = ['114390552657346311906'];
    // in order: jr, rado, jard, miky
    private _adminUidList = ['mkomTbU76VUR5tIoLmmyP1luR5q1', 'Gxr9qQ1pczOCLyncfhLiLdhvhy32',
    'xFDVJ8Dq9CZR8PmiixbSNX5FpNv2' ,'VtvMxuaYxGQp1eROh63SkO1S13k1'];
    // public listOfChallenges;
    public challengeBadge: number;
    private _loginInfo;


    constructor(public login: LoginService, private _challengeDB: ChallengeDatabaseService) {

        this.login.getLoggedInUserObs().subscribe(info => {
            this._loginInfo = info;
            this._challengeDB.getListOfChallenges().subscribe(challengeList => {
                this.challengeBadge = 0;
                challengeList.forEach(challenge => {
                if (challenge['challengerGoogle'] === this._loginInfo.uid) {
                    this.challengeBadge++;
                }
                if (challenge['defenderGoogle'] === this._loginInfo.uid) {
                    this.challengeBadge++;
                }
                });
            });
        }); 

    }

    public adminCheck(uid: string) {
        return this._adminUidList.includes(uid);
    }

}
