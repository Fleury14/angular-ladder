import { Component, OnInit } from '@angular/core';

import { NewsDatabaseService } from './../../../../services/database/news-databse.service';
import NewsItem from './../../../../interfaces/news-item';

// import { NewsManagementComponent } from './../news-management.component';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-admin-view-news',
    templateUrl: './view-news.component.html'
})

export class ViewNewsComponent implements OnInit {

    public newsList: NewsItem[];

    constructor( private _newsService: NewsDatabaseService ) {
    }

    ngOnInit() {
        console.log('view news component...');
        this._newsService.newsObservable
        .map(newslist => {
            return newslist.map(newsItem => {
                const myNewsItem: NewsItem = {
                    author: newsItem.author,
                    date: newsItem.date,
                    content: newsItem.content
                };
                return myNewsItem;
            });
        })
        .subscribe(news => {
            this.newsList = news;
        });


    }

}
