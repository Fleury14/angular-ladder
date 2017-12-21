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

    // variables for editing news items
    public canEditNews = false;
    public selectedNewsItem;
    public authorEdit: String;
    public contentEdit: String;

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
        .map(data => {
            data.sort(function(a, b) { return b.dateUnix - a.dateUnix; } );
            return data;
        })
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

        // Create the object that will be sent to the database. Include both a visible date for printing and a unix date for sorting
        const newsItemToBeSent = {
            date: this._niceDate(this.todaysDate),
            dateUnix: Date.now(),
            author: formValue.author,
            content: formValue.content
        }

        // confirm a send before actually pushing to the database
        if (confirm(`Verify sending of news item by ${newsItemToBeSent.author}`)) {
            console.log(`Submitting news by ${newsItemToBeSent.author} on ${newsItemToBeSent.date}.`);
            this._newsData.addNews(newsItemToBeSent);
            // reset fields after submitting
            this.author = '';
            this.content = '';
        }

    } // end submitNews

    private _niceDate(date: Date) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const result = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
        return result;
    } // end niceDate

    public deleteNewsItem(id) {
        this._newsData.deleteNews(id);
    } // end delete newsitem

    public editNewsItem(id) {
        this.canEditNews = true;
        this._newsData.getNewsById(id).map(data => {
            const result = {
                author: data[0],
                content: data[1],
                date: data[2],
                dateUnix: data[3],
                id: id
            };
            return result;
        })
        .subscribe(data => {
            if(data) {
                console.log('selected item:', data);
                this.selectedNewsItem = data;
                this.authorEdit = this.selectedNewsItem.author;
                this.contentEdit = this.selectedNewsItem.content;
            } else {
                console.log('No news item. Possible bad id.');
            }
            return data;
        });
    }

}
