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
    public secondList: NewsItem[];
    private moreArr;

    constructor( private _newsService: NewsDatabaseService ) {
    }

    ngOnInit() {

        this._newsService.moretest.subscribe(data => {
            console.log('.moretest:', data);
            this.secondList = [];
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
                this.secondList.push(soCloseItem);
            }
            console.log('endresult omg did we do it inside the component??', this.secondList);
        });

        console.log('view news component...', this._newsService.secondArr);
        // this._newsService.newsObservable
        // .map(newslist => {
        //     return newslist.map(newsItem => {
        //         console.log('maybe', newslist.indexOf(newsItem), this._newsService.keylist);
        //         const myNewsItem: NewsItem = {
        //             author: newsItem.author,
        //             date: newsItem.date,
        //             content: newsItem.content,
        //             id: this._newsService.keylist[newslist.indexOf(newsItem)]
        //         };
        //         return myNewsItem;
        //     });
        // })
        // .subscribe(news => {
        //     this.newsList = news;
        // });

    } // end oninit

    public deleteNewsItem(id: string) {
        console.log(`deleting item with id ${id}`);
    }
}
