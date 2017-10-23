import { Component } from '@angular/core';

import { NewsService } from './../../../services/news-service';


@Component({
    selector: 'app-admin-news',
    templateUrl: './news-management.component.html',
    styleUrls: [ './news-management.component.css']
})

export class NewsManagementComponent {

    public newsTotal = this.news.getNewsLength();

    constructor( public news: NewsService) {}

}
