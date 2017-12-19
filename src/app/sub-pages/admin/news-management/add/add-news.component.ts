import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NewsDatabaseService } from './../../../../services/database/news-databse.service';

@Component({
    selector: 'app-admin-add-news',
    templateUrl: './add-news.component.html'
})


export class AddNewsComponent {
    public todaysDate: Date;
    private _daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    private _monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'Septmeber', 'October', 'November', 'December'];

    constructor( private _database: NewsDatabaseService, private _router: Router, private _activatedRoute: ActivatedRoute  ) {
        this.todaysDate = new Date();
    }

    public submitForm(form) {

        const niceDate = this._daysOfWeek[this.todaysDate.getDay()] + ', ' + this._monthsOfYear[this.todaysDate.getMonth()] + ' '
        + this.todaysDate.getDate() + ' ' + this.todaysDate.getFullYear();

        const newItem = {
            author: form.author,
            date: niceDate,
            content: form.content
        };

        return this._database.addNews(newItem)
        .then(() => this._router.navigate(['../view'], {relativeTo: this._activatedRoute}));
    }
}
