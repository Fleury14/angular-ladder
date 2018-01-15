import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()

export class LoginService {

    private _userObs; // will contain login info

    constructor (public afAuth: AngularFireAuth, private route: Router) {
        this._userObs = this.afAuth.authState;
    }

    public login() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    public logout() {
        this.afAuth.auth.signOut();
        if (this.route.url.includes('admin') || (this.route.url.includes('dashboard'))) {
            this.route.navigateByUrl('home');
        }
    }

    public getLoggedInUser() {
        return this.afAuth.auth.currentUser;
    }

        // this method is how other classes get the user logged in
    public getLoggedInUserObs(): Observable<firebase.User> {
            return this._userObs;
        }

    public checkStuff() {
        console.log(this.afAuth.authState, this.afAuth.auth.currentUser, this.afAuth.idToken);
    }
}
