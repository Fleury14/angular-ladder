import { Injectable } from '@angular/core';

@Injectable()

export class LoginService {

    private _loggedInUser = null;

    public login() {
        this._loggedInUser = `It's a me, Mario!`;
    }

    public logout() {
        this._loggedInUser = null;
    }

    public getLoggedInUser() {
        return this._loggedInUser;
    }
}
