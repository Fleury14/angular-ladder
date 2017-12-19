import { Component, OnInit } from '@angular/core';

import { NewsService } from './../../../services/news-service';
import { NewsDatabaseService } from './../../../services/database/news-databse.service';
import { Observable } from 'rxjs/Observable';

import { NgForm } from '@angular/forms';

import NewsItem from './../../../interfaces/news-item';


@Component({
    selector: 'app-admin-news',
    templateUrl: './news-management.component.html',
    styleUrls: [ './news-management.component.css']
})

export class NewsManagementComponent implements OnInit {

    public newsTotal = this.news.getNewsLength();
    public newsList = [];
    public newsListWithId = [];

    // form pieces
    public content: string;
    public author: string;
    public newsForm: NgForm;
    public todaysDate = new Date();
    private _days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor( public news: NewsService, private _newsData: NewsDatabaseService) {


    }

    ngOnInit() {

        const lol = this._newsData.getNews()
        .subscribe(result => {
            // console.log('rr result', result);
            this.newsListWithId = result;
            // console.log('rr method result',this.newsListWithId);
        });
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
        .subscribe( moreNews => {
            this.newsList = [];
            this.newsList = this.newsList.concat(moreNews);
            console.log('from news base component', this.newsList);
        });

        
    }

    // method for submitting a new news item via form
    public submitNews(formValue) {

        const newsItemToBeSent = {
            date: this._niceDate(this.todaysDate),
            author: formValue.author,
            content: formValue.content
        }

        console.log(`Submitting news by ${newsItemToBeSent.author} on ${newsItemToBeSent.date}.`);
        this._newsData.addNews(newsItemToBeSent);

    } // end submitNews

    private _niceDate(date: Date) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const result = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
        return result;
    }

}
