import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-admin-add-news',
    templateUrl: './add-news.component.html'
})


export class AddNewsComponent {
    public todaysDate: Date;
    private _daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    private _monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'Septmeber', 'October', 'November', 'December'];

    constructor() {
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
        console.log(newItem);
    }
}
