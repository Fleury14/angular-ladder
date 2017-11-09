import { Component, OnInit } from '@angular/core';

import { NewsService } from './../../../services/news-service';
import { NewsDatabaseService } from './../../../services/database/news-databse.service';
import { Observable } from 'rxjs/Observable';

import NewsItem from './../../../interfaces/news-item';


@Component({
    selector: 'app-admin-news',
    templateUrl: './news-management.component.html',
    styleUrls: [ './news-management.component.css']
})

export class NewsManagementComponent implements OnInit {

    public newsTotal = this.news.getNewsLength();
    public newsList = [];

    constructor( public news: NewsService, private _newsData: NewsDatabaseService) {

        // map observable from the service and then subscribe to it via the newslist array
        this._newsData.newsObservable.map(newslist => {
            return newslist.map(newsItem => {
                const myNewsItem: NewsItem = {
                    author: newsItem.author,
                    date: newsItem.date,
                    content: newsItem.content
                };
                return myNewsItem;
            });
        })
        .subscribe( moreNews => {this.newsList = this.newsList.concat(moreNews);
            console.log('from news base component', this.newsList);
        });
    }

    ngOnInit() {
        // console.log(this.newsData.);
    }

}
