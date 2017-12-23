import { Component } from '@angular/core';

import { LoginService } from './../services/login.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})

export class NavComponent {

    private _adminList = ['114390552657346311906'];
    // in order: jr, rado
    private _adminUidList = ['mkomTbU76VUR5tIoLmmyP1luR5q1', 'Gxr9qQ1pczOCLyncfhLiLdhvhy32', 'xFDVJ8Dq9CZR8PmiixbSNX5FpNv2'];

    constructor(public login: LoginService) {
    }

    public adminCheck(uid: string) {
        return this._adminUidList.includes(uid);
    }

}
