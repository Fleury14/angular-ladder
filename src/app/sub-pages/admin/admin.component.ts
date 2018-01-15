import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

    public hideMenu = true; // flag that determins if menu is hidden

    constructor(private _route: Router) {}

    // method to toggle hideMenu to true or false on a click
    public toggleMenu() {
        // console.log('burger triggered');
        if (this.hideMenu === true) {
            this.hideMenu = false;
        } else {
            this.hideMenu = true;
        }
    }

    ngOnInit() {
        // subscribe to the router events...
        this._route.events.subscribe(routeChange => {
            // ..so that this code to hide the menu runs every time a route is changed. this way,
            // when someone clicks on a link in the menu, the menu hides automatically
            this.hideMenu = true;
        });
    }
}
