import { Component, AfterViewInit } from '@angular/core';

import NewsItem from './../interfaces/news-item';
import Challenge from './../interfaces/challenge';
import MatchRecord from './../interfaces/match-record';
import MatchRecordList from './../classes/match-history-list';

import { TwitchStatusService } from './../services/twitch-status.service';
import { MatchHistoryService } from './../services/match-history.service';
import { ChallengeListService } from './../services/challenge-list.service';
import { NewsService } from './../services/news-service';
import { NewsDatabaseService } from './../services/database/news-databse.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements AfterViewInit {

    public databaseNewsTest = this._newsData.getFirstThree();
    public databaseOldNews = this._newsData.getTheRest();
    public recentNews = this.news.getFirstThree(); // put the recent news in this var
    public olderNews = this.news.getOlderNews(); // and the older news in this var
    public sidebarChallengeList: Challenge[]; // make an array that will hold the challenges that will be displayed in the side bar.
    // the actual list is instantiated in the constructor

    public recentMatches = this.matchList.getRecentMatches();
    // and use the function in the class to get the 3 most recent ones and put them in this array
    public listOfStreams: string[];
    public streamInfo;

    constructor(
        public twitchStatus: TwitchStatusService,
        private matchList: MatchHistoryService,
        private homeList: ChallengeListService,
        private news: NewsService,
        private _newsData: NewsDatabaseService
    ) { // build note: this servce may need to be public
        this.sidebarChallengeList = [];
        for (let i = 0; i < this.homeList.getLength(); i++) {
            this.sidebarChallengeList.push(this.homeList.getChallenge(i));
        } // end for

        // List of Stream to be shown on front page
        this.listOfStreams = this.twitchStatus.getStreamList();

        this.twitchStatus.buildStatus();

        this.databaseNewsTest.subscribe( data => {
            console.log('from database service:', data);
        });

        this.databaseOldNews.subscribe( data => {
            console.log('older news from database service', data);
        });
    }

    ngAfterViewInit() {
        // SHOW-HIDE NEWS SECTION

        // show news button
        const showNewsBtn = document.getElementById('showNewsButton');
        const olderNews = <HTMLElement>document.querySelector('.hidden-news');
        let newsHidden = true; // flag to denote if older news is hidden or not

        function toggleNews() { // function to toggle older news showing
            if (newsHidden === true) {
                olderNews.style.height = '100%';
                showNewsBtn.innerText = 'Hide Older News';
                newsHidden = false;
            } else {
            olderNews.style.height = '0px';
            showNewsBtn.innerText = 'Show Older News';
            newsHidden = true;
            }
        }

        showNewsBtn.addEventListener('click', toggleNews);
    }


 }
