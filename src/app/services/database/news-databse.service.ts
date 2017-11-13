import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';

import NewsItem from './../../interfaces/news-item';

@Injectable()

export class NewsDatabaseService {

    private _news: NewsItem[];
    public keylist: string[] = [];
    public newsObservable: Observable<NewsItem[]>;
    public snapshotObs;

    constructor(private _database: AngularFireDatabase ) {

        this.newsObservable = this._database.list('news').valueChanges<NewsItem>();
        this.snapshotObs = this._database.list('news').snapshotChanges();

        this.snapshotObs.map(data => {
            for (let things of data) {
                this.keylist.push(things.key);
            }
        })
        .subscribe(data => {console.log(this.keylist); });

        this.newsObservable
        .map(newslist => {

            return newslist.map(newsItem => {
                console.log('.map from service', newslist.indexOf(newsItem), this.keylist, this.keylist[0]);
                const myNewsItem: NewsItem = {
                    author: newsItem.author,
                    date: newsItem.date,
                    content: newsItem.content,
                };
                return myNewsItem;
            });
        })
        .subscribe(news => {
            this._news = news;
            // console.log(this._news);
        });
    }

    public addNews(date: Date, news: NewsItem) {
        console.log('Adding to database...');
        return this._database.list('news/').push(news);
    }

    public deleteNews(newsId: string) {
        console.log('Deleting from database....');
        return this._database.list('news/').remove(newsId);
    }

    // public getNews() {
    //     return this.newsObservable.map(news => {
    //         console.log(news);
    //     });
    // }

}
