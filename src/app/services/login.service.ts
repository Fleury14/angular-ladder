import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()

export class LoginService {

    private _loggedInUser = null;

    constructor (public afAuth: AngularFireAuth) {}

    public login() {
        this._loggedInUser = `It's a me, Mario!`;
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    public logout() {
        this._loggedInUser = null;
        this.afAuth.auth.signOut();
    }

    public getLoggedInUser() {
        return this.afAuth.auth.currentUser;
    }

    public checkStuff() {
        console.log(this.afAuth.authState, this.afAuth.auth.currentUser, this.afAuth.idToken);
    }
}
