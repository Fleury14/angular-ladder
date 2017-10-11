import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-404',
    templateUrl: './missing-page.component.html'
})

export class MissingPageComponent {

    constructor(private router: Router) { }

    public goHome() {
        this.router.navigateByUrl('home');
    }
 }
