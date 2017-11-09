import { Component, OnInit } from '@angular/core';

import { NewsDatabaseService } from './../../../../services/database/news-databse.service';
import NewsItem from './../../../../interfaces/news-item';

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
        // map observable from the service and then subscribe to it via the newslist array
        this._newsService.newsObservable.map(newslist => {
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
            console.log('from news view componenet', this.newsList);
        });
    }

}
