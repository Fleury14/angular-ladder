import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

    public hideMenu = true;

    constructor(private _route: Router) {}

    public toggleMenu() {
        console.log('burger triggered');
        if (this.hideMenu === true) {
            this.hideMenu = false;
        } else {
            this.hideMenu = true;
        }
    }

    ngOnInit() {
        this._route.events.subscribe(routeChange => {
            this.hideMenu = true;
        });
    }
}
