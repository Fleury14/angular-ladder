import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-submit',
    templateUrl: './submitted.component.html',
    styleUrls: [ './submitted.component.css']
})

export class SubmitComponent implements OnInit {

    public currentParam;

    constructor (private _router: Router, private _actRoute: ActivatedRoute) {}

    ngOnInit() {
        this._actRoute.params.subscribe((params: Params) => {
            if (params.type) {
                this.currentParam = params.type;
            }
        });

        setTimeout(() => {
            this._router.navigate(['home'], {});
        }, 3000);
    }
}
