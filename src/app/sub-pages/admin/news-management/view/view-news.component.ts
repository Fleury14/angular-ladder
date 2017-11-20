import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    public thirdList: NewsItem[];
    private moreArr;

    constructor( private _newsService: NewsDatabaseService, private _actroute: ActivatedRoute ) {

    }

    ngOnInit() {

        this._actroute.paramMap.subscribe(val => {
            this._newsService.moretest.subscribe(data => {
                console.log('moved to param subscription', data);
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
            this.thirdList = this._newsService.secondArr;
        });


    } // end oninit

    public deleteNewsItem(id: string) {
        this._newsService.deleteNews(id);
    }
}
