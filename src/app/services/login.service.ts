import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()

export class LoginService {


    constructor (public afAuth: AngularFireAuth, private route: Router) {}

    public login() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    public logout() {
        this.afAuth.auth.signOut();
        if (this.route.url.includes('admin')) {
            this.route.navigateByUrl('home');
        }
    }

    public getLoggedInUser() {
        return this.afAuth.auth.currentUser;
    }

    public checkStuff() {
        console.log(this.afAuth.authState, this.afAuth.auth.currentUser, this.afAuth.idToken);
    }
}
