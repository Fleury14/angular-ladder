import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-add-news',
    templateUrl: './add-news.component.html'
})


export class AddNewsComponent {
    public todaysDate: Date;

    constructor() {
        this.todaysDate = new Date();
    }
}
