import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()

export class RouterGuard implements CanActivate {

    private _adminUidList = ['mkomTbU76VUR5tIoLmmyP1luR5q1', 'Gxr9qQ1pczOCLyncfhLiLdhvhy32',
    'xFDVJ8Dq9CZR8PmiixbSNX5FpNv2', 'VtvMxuaYxGQp1eROh63SkO1S13k1'];


    constructor (private login: LoginService, private route: Router) {}

    canActivate() {
        if (this.login.afAuth.auth.currentUser === null) { // check to see if a user is logged in at all
            this.route.navigate(['home']); // if not, get them out
            return false;
        } else if (this._adminUidList.includes(this.login.afAuth.auth.currentUser.uid)) {
            // otherwise check to see if its an acceptable admin login
            return true;
        } else { // if not, get them out too
            this.route.navigate(['home']);
            return false;
        }
    }
}
