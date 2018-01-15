import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()

export class LoggedInRouterGuard implements CanActivate {

    constructor (private login: LoginService, private route: Router) {}

    // this router guard prevents people from visiting a page if they're not logged in
    canActivate() {
        // map the observable from the login service...
        return this.login.getLoggedInUserObs().map(user => {
            // if the user exists, we good...
            if (user) {
                return true;
            }

            // since if the user was good we already returned, this means any code here only executes if there's no user
            // thus, send em packing...
            this.route.navigate(['home']);
            return false;

        });

    }
}
