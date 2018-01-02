import { Component, AfterViewInit } from '@angular/core';

import NewsItem from './../interfaces/news-item';
import Challenge from './../interfaces/challenge';
import MatchRecord from './../interfaces/match-record';
import MatchRecordList from './../classes/match-history-list';

import { TwitchStatusService } from './../services/twitch-status.service';
import { MatchHistoryService } from './../services/match-history.service';
import { NewsService } from './../services/news-service';
import { NewsDatabaseService } from './../services/database/news-databse.service';
import { ChallengeDatabaseService } from './../services/database/challenge-database.service';
import { MatchHistoryDatabaseService } from './../services/database/match-history-database.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements AfterViewInit {

    // observables that will contain news from database
    public databaseFirstThree = this._newsData.getFirstThree();
    public databaseTheRest = this._newsData.getTheRest();

    // older news list. NOTE: i'm keeping the older stuff around as a backup in case the database goes poo poo
    // and i need something as a pseudo-backup
    public recentNews = this.news.getFirstThree(); // put the recent news in this var
    public olderNews = this.news.getOlderNews(); // and the older news in this var
    public sidebarChallengeList: Challenge[]; // make an array that will hold the challenges that will be displayed in the side bar.
    // the actual list is instantiated in the constructor

    public recentMatches = this.matchList.getRecentMatches();
    // and use the function in the class to get the 3 most recent ones and put them in this array
    public listOfStreams: string[];
    public streamInfo;
    public listOfChallenges; // will contain list of challenges
    public listOfMatches; // will contain matchlist

    public _MATCHTIME = 1209600000; // how far back we want to display matches on the front page.. in milliseconds...

    constructor(
        public twitchStatus: TwitchStatusService,
        private matchList: MatchHistoryService,
        private news: NewsService,
        private _newsData: NewsDatabaseService,
        private _challengeDB: ChallengeDatabaseService,
        private _matchDB: MatchHistoryDatabaseService
    ) {

        // List of Stream to be shown on front page
        this.listOfStreams = this.twitchStatus.getStreamList();

        this.twitchStatus.buildStatus();

        this.databaseFirstThree.subscribe( data => {
            // console.log('from database service:', data);
        });

        // instantiate challenge list
        this._challengeDB.getListOfChallenges().subscribe(challengeList => {
            this.listOfChallenges = challengeList;
        });

        this.databaseTheRest.subscribe( data => {
            // console.log('older news from database service', data);
        });

        // get list of matches and remove matches that are over 2 weeks old
        // make sure to go through the list backwards to avoid skips in the index
        // NOTE: the list NEEDS to be sort my date in ascending order
        this._matchDB.getListOfMatches().map(matches => {
            for (let i = matches.length - 1; i >= 0; i--) {
                if (Date.now() - matches[i]['dateCompleted'] > this._MATCHTIME) {
                    matches.splice(i, 1);
                }
            }
            return matches;
        }).subscribe(matches => {
            console.log('recent match list:', matches);
        });
    }

    // method to convert unix
    public unixDateConv(unix: number) {
        return new Date(unix);
    }

    public parseNewLine(content: string) {
        const newLine = /\n/gi;
        if (content) {
            return content.replace(newLine, '<br>');
        } else {
            return content;
        }
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
