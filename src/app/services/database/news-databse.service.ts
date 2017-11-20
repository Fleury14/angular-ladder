import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';

import NewsItem from './../../interfaces/news-item';
import { AngularFireList, AngularFireObject, FirebaseOperation } from 'angularfire2/database/interfaces';

@Injectable()

export class NewsDatabaseService {

    private _news: NewsItem[];
    public keylist: string[] = [];
    public newsObservable: Observable<NewsItem[]>;
    // public snapshotObs;
    public testObs;
    public moretest;
    public moreArr;
    public secondArr;

    // ngOnInit() {
    //     console.log ('ONINIT');
    //     this.moretest = this._database.list('/news');
    //     console.log('from oninit:', this.moretest);
    // }

    constructor(private _database: AngularFireDatabase ) {


        this.newsObservable = this._database.list('news').valueChanges<NewsItem>();
        // this.snapshotObs = this._database.list('news').snapshotChanges();
        this.moretest = this._database.object('/news').valueChanges();

        this.moretest.subscribe(data => {
            console.log('.moretest:', data);
            this.secondArr = [];
            this.moreArr = data;
            for (let item in data) {
                const itemKey = item;
                // console.log('inside loop', item);
                // console.log('content too? please?', this.moreArr[item]);
                this.moreArr[item].id = item;
                const soCloseItem = {
                    id: item,
                    date: this.moreArr[item].date,
                    content: this.moreArr[item].content,
                    author: this.moreArr[item].author
                };
                this.secondArr.push(soCloseItem);
            }
            console.log('endresult omg did we do it?', this.secondArr);
        });


        // this.snapshotObs
        // .subscribe(data => {
        //     for (let things of data) {
        //         this.keylist.push(things.key);
        //         console.log('from service subscribe: ', this.keylist, this.keylist[0]);
        //     }
        // });




        this.newsObservable
        .map(newslist => {

            return newslist.map(newsItem => {

                // console.log('.map from service', newslist.indexOf(newsItem), this.keylist, this.keylist[0]);
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
