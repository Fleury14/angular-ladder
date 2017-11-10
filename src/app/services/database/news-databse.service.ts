import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';

import NewsItem from './../../interfaces/news-item';

@Injectable()

export class NewsDatabaseService {

    private _news: NewsItem[];

    public newsObservable: Observable<NewsItem[]>;

    constructor(private _database: AngularFireDatabase ) {

        this.newsObservable = this._database.list('news').valueChanges<NewsItem>();

        this.newsObservable.subscribe(news => {
            this._news = news;
            // console.log(this._news);
        });
    }

    public addNews(date: Date, news: NewsItem) {
        console.log('Adding to database...');
        return this._database.list('news/').push(news);
    }

    // public getNews() {
    //     return this.newsObservable.map(news => {
    //         console.log(news);
    //     });
    // }

}
