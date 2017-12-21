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
    public rootObs: Observable<any>;
    // public snapshotObs;
    public testObs;
    public moretest: Observable<any>;
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
        this.rootObs = this._database.list('/').valueChanges();

        this.rootObs.subscribe(data => {
            // console.log('root attempt:', data[0]);
        });

        this.moretest.subscribe(data => {
            // console.log('.moretest:', data);
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

            for (let item in newslist) {
                console.log('key list??: ', item);
            }

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

    public addNews(news: NewsItem) {
        console.log('Adding to database...', news);
        return this._database.list('news/').push(news);
    }

    public deleteNews(newsId: string) {
        if (confirm('Are you sure you wanna delete this news item?')) {
            console.log('Deleting from database....');
            return this._database.list('news/').remove(newsId);
        }

    } // end delete news

    // attempt to get news the same way its gotten in the room reserve service
    public getNews() {
        console.log('no really, get news was called');
        return this.rootObs.map(news => {
            const anotherNewsList = [];

            for (let newsKey in news[0]) {
                const evenMore = news[0][newsKey];
                evenMore.id = newsKey;
                anotherNewsList.push(evenMore);
            }

            news = anotherNewsList;
            console.log('rr method check', news);
            return news;

        });
    }

    // method for getting the first three news items for the front page
    public getFirstThree() {
        // initialize array that will be returned
        const firstThree = [];

        // beginning of map same as getting all the news, until...
        return this.rootObs.map(news => {
            const anotherNewsList = [];

            for (let newsKey in news[0]) {
                const evenMore = news[0][newsKey];
                evenMore.id = newsKey;
                anotherNewsList.push(evenMore);
            }

            news = anotherNewsList;

            // ... this! first sort the array in descending order according to the unix date
            news.sort(function(a, b) {return b.dateUnix - a.dateUnix; } );

            // put the first three items in our array...
            firstThree[0] = news[0];
            firstThree[1] = news[1];
            firstThree[2] = news[2];

            // then return that array. now the result should be the three most recent news items
            return firstThree;
        });
    } // end getfirstthree

    public getTheRest() {

        // beginning of map same as getting all the news, until...
        return this.rootObs.map(news => {
            const anotherNewsList = [];

            for (let newsKey in news[0]) {
                const evenMore = news[0][newsKey];
                evenMore.id = newsKey;
                anotherNewsList.push(evenMore);
            }

            news = anotherNewsList;

            // ... this! first sort the array in descending order according to the unix date
            news.sort(function(a, b) {return b.dateUnix - a.dateUnix; } );

            // remove the three most recent items
            news.splice(0, 3);

            // then return that array. now the result should be the three most recent news items
            return news;
        });
    } // end gettherest

    // method to get one particular news item when only given the id
    public getNewsById(id: string) {
        return this._database.list('/news/' + id).valueChanges();
    }

}
