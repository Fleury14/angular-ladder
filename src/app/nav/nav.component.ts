import { Component } from '@angular/core';

import { LoginService } from './../services/login.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})

export class NavComponent {

    constructor(public login: LoginService) {}

}
