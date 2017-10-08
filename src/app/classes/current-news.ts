import NewsItem from '../interfaces/news-item';

export default class CurrentNews {
    private news: NewsItem[];

    private buildNewsList() {
        this.news = [];

        // INSERT NEWS ITEMS HERE FOR NOW
        this.news.unshift({
            date: 'October 8th, 2017',
            author: 'Fleury14',
            content: `Added the stream status for several CenCal streams. ESL_SC2 is also listed simply as a reference
            so I can make sure the stream viewer is working, since it's always up.`
        },{
            date: 'October 5th, 2017',
            author: 'Fleury14',
            content: 'Did a little redesigning and font changing.'
        },
        {
            date: 'September 27th, 2017',
            author: 'Fleury14',
            content: 'Standings should be sortable. Began preparations for Marvel Ladder.'
        },
        {
            date: 'September 23th, 2017',
            author: 'Fleury14',
            content: `Sorry about the lack of updates, as I've been learning new things
            and I'm working on a way to impelement them to the site.
            In the meantime, Marvel is out! I may start a Marvel ladder once everyone returns from SCR, so look forward to that.`
        },
        {
            date: 'July 18th, 2017',
            author: 'Fleury14',
            content: `I hope everyone had a great time at EVO. Now that we're back, let's try to get some more challenges up.`
        },
        {
            date: 'July 12th, 2017',
            author: 'Fleury14',
            content: 'Added a couple of players, and included PSN ID on the Standings page.'
        },
        {
            date: 'July 11th, 2017',
            author: 'Fleury14',
            content: `Page should be live, added first few entrants.
            Please not that due to EVO, should anyone enter a challenge now there will be a 4 day extension,
            meaning any challenge befor 7/13 will last 11 days instead of 7.`
        }
    );
        console.log('News list content initialized.');
    } // end buildnewsList

    constructor() {
        this.buildNewsList();
    }

    public getFirstThree() {
        return [this.news[0], this.news[1], this.news[2]];
    }

    public getOlderNews() {
        const olderNews: NewsItem[] = [];
        for (let i = 3; i < this.news.length; i++) {
            olderNews.push(this.news[i]);
        }
        return olderNews;
    }
}
