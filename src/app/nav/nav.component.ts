import { Component } from '@angular/core';

import { LoginService } from './../services/login.service';
import { LadderDatabaseService } from './../services/database/ladder-database.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})

export class NavComponent {

    private _adminList = ['114390552657346311906'];
    // in order: jr, rado
    private _adminUidList = ['mkomTbU76VUR5tIoLmmyP1luR5q1', 'Gxr9qQ1pczOCLyncfhLiLdhvhy32', 'xFDVJ8Dq9CZR8PmiixbSNX5FpNv2'];
    public listOfGames;
    private _loginInfo;
    public challengeBadge: number;


    constructor(public login: LoginService, private _ladderDB: LadderDatabaseService) {
    }

    public adminCheck(uid: string) {
        return this._adminUidList.includes(uid);
    }

}
