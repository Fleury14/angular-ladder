import { Component } from '@angular/core';

import { LoginService } from './../../services/login.service';
import { LadderDatabaseService } from './../../services/database/ladder-database.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.css']
})

export class DashboardComponent {

    constructor(public login: LoginService, private _ladderDB: LadderDatabaseService) {

    }

}
