import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()

export class RouterGuard implements CanActivate {

    constructor (private login: LoginService, private route: Router) {}

    canActivate() {
        if (this.login.afAuth.auth.currentUser === null) { // check to see if a user is logged in at all
            this.route.navigate(['home']); // if not, get them out
            return false;
        } else if (this.login.afAuth.auth.currentUser.providerData[0].uid === '114390552657346311906' ) {
            // otherwise check to see if its an acceptable admin login
            return true;
        } else { // if not, get them out too
            this.route.navigate(['home']);
            return false;
        }
    }
}
