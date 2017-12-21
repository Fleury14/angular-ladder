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
    public canEditNews = false; // flag to toggle whether to display editing fields or adding fields
    public selectedNewsItem; // the entire news item that was selected
    public authorEdit: string; // the contents of the author field binded 2-ways
    public contentEdit: string; // ditto the content field

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

    // this method grabs a news item from the database based on the id gotten from the html loop, and then populates the editing
    // fields to allow editing.
    public editNewsItem(id) {
        this.canEditNews = true; // change the flag to show the edit fields and hide the add fields

        this._newsData.getNewsById(id).map(data => {
            // because the data gotten from the service is sent back in array form, we use the map to translate it back to object form
            // NOTE: this particular method doesnt jive with the NewsItem typing which is why I did not delcared selectedNewsItem 
            // as a :NewsItem above
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
            // with the data now transforms into a more readable object we can do stuff with it. First a simple error check with an if
            if(data) {
                console.log('selected item:', data);
                // ..then set the selected news item to the entire object
                this.selectedNewsItem = data;
                // and populate the fields with the appropriate content
                this.authorEdit = this.selectedNewsItem.author;
                this.contentEdit = this.selectedNewsItem.content;
            } else {
                console.log('No news item. Possible bad id.');
            }
            return data;
        });
    } // end edit news item

    // this method simply reverts the flag back to false, hiding the edit view and showing the add view
    public cancelEditing() {
        this.canEditNews = false;
    } // end cancelEditing

    // method to update a news item with the data in the edit fields
    public changeItem(id) {
        this._newsData.updatedNewsById(id, this.authorEdit, this.contentEdit);
        // rhide the editing fields uppon submitting. no need to reset them, since in order to see them again, a news item
        // will have to be clicked which would repopulate the fields anywaay
        this.canEditNews = false;
    }

}
