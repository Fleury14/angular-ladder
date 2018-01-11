import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-submit',
    templateUrl: './submitted.component.html',
    styleUrls: [ './submitted.component.css']
})

export class SubmitComponent implements OnInit {

    public currentParam;
    private _timeOut;

    constructor (private _router: Router, private _actRoute: ActivatedRoute) {}

    ngOnInit() {
        this._actRoute.params.subscribe((params: Params) => {
            if (params.type) {
                this.currentParam = params.type;
            }
        });

        this._timeOut = setTimeout(() => {
            this._router.navigate(['home'], {});
        }, 5000);

        // cancel timeout if they navigate somewhere else prior to being routed home
        this._router.events.subscribe(routeChange => {
            clearTimeout(this._timeOut);
        });
    }

    // cancel timeout if they click the button themselves
    public goHome() {
        clearTimeout(this._timeOut);
        this._router.navigate(['home']);
    }
}
