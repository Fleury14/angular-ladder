import { Component, AfterViewInit } from '@angular/core';
import NewsItem from './../interfaces/news-item';
import CurrentNews from './../classes/current-news';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements AfterViewInit {

    private news = new CurrentNews;
    public recentNews = this.news.getFirstThree();
    public olderNews = this.news.getOlderNews();

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
