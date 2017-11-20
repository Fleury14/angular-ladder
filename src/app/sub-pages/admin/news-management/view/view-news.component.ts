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
        console.log('view news component...', this._newsService.secondArr);
        this._newsService.newsObservable
        .map(newslist => {
            return newslist.map(newsItem => {
                console.log('maybe', newslist.indexOf(newsItem), this._newsService.keylist);
                const myNewsItem: NewsItem = {
                    author: newsItem.author,
                    date: newsItem.date,
                    content: newsItem.content,
                    id: this._newsService.keylist[newslist.indexOf(newsItem)]
                };
                return myNewsItem;
            });
        })
        .subscribe(news => {
            this.newsList = news;
        });


    }

}
