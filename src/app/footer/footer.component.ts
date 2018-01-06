import { Component, AfterViewInit } from '@angular/core';

import { MatchHistoryDatabaseService } from './../services/database/match-history-database.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})


export class FooterComponent implements AfterViewInit {


  public listOfRecentMatches; // will contain match history list
  public listOfMatchSnapshot;

  // instantiate lists for display
  constructor(private _matchDB: MatchHistoryDatabaseService) {
  }

  ngAfterViewInit() {


        const tickerSub = document.querySelector('#ticker-subject');
        const tickerText = document.querySelector('#ticker-text');
        const textContent = [];
        let currentItem = 0;

        // console.log(tickerSub);

        // content here
        textContent.push(['Tournament Results', 'Bitwise Beatdown 7 Results from 10/28']);
        textContent.push(['Tournament Results', 'Marvel: 1. Negus Eyoel  2. ThatOneOtherDude  3. Domezy']);
        textContent.push(['Tournament Results', 'Hearthstone: 1. Moonfish  2. Osvirius  3. Audriolen ']);
        textContent.push(['Tournament Results', 'Mixup Monthly: Special Edition Results from 9/28 (Marvel Only)']);
        textContent.push(['Tournament Results', '1. Scott Lee  2. Kevin  3. Tristen  4. Negus Eyoel']);
        textContent.push(['Tournament Results', '5. Negaduck  5. Fleury14  7. Kindafresh  7. Siphon']);
        // textContent.push(['Recent Matches - Tekken', '8/16: (2) Domezy(Kat) def. (1) Reckless(Steve/Hwo) 5-1.']);
        // textContent.push(['Recent Matches - Tekken', '8/16: (4) Fobi_Yo(Yoshi/Jack) def. (5) Fleury14(Lars) 5-2.']);
        // textContent.push(['Recent Matches - Tekken', '8/3: (6) Fleury14(Lars) def. (5) Jard(Paul) 5-1.']);
        // textContent.push(['Recent Matches - Tekken', '7/24: (3) Eraldo_Coil def. (4) Fobi_Yo 5-3.']);
        // textContent.push(['Rankings - Tekken', '1. Domezy (2-0)']);
        // textContent.push(['Rankings - Tekken', '2. Reckless (1-1)     3. Eraldo_Coil (2-1)']);
        // textContent.push(['Rankings - Tekken', '4. Fobi_Yo (2-1)     5. Fleury14 (1-3)']);

        // instantiate lists here because contructor would take place too late
        this._matchDB.getListOfMatches().subscribe(
          (matchList) => {
            this.listOfRecentMatches = matchList;
            this.listOfRecentMatches.forEach(match => {
              const completed = new Date(match.dateCompleted);
              textContent.push([`Recent Matches - ${match.game}`,
              `${completed.getMonth() + 1}/${completed.getDate()}: (${match.challengerRank}) ${match.challengerName} <span class="ticker-match-score-box">${match.challengerScore}</span> (${match.defenderRank}) ${match.defenderName} <span class="ticker-match-score-box">${match.defenderScore}</span>`]);
            });
          },
          (error) => { console.log('Error:', error); },
          () => {console.log('on to the next thing?'); });

        // experimenting with smapshot instead of valuechanges, keeping code here for reference
        // this._matchDB.getMatchListSnapshot().subscribe(matchSnap => {
        //   this.listOfMatchSnapshot = [];
        //   matchSnap.sort(function(a, b) { return b['payload'].val()['dateCompleted'] - a['payload'].val()['dateCompleted']; });
        //   return matchSnap.map(match => {
        //     const completed = new Date(match.payload.val().dateCompleted);
        //     textContent.push([`Recent Matches - ${match.payload.val().game}`,
        //     `${completed.getMonth() + 1}/${completed.getDate()}: (${match.payload.val().challengerRank}) ${match.payload.val().challengerName} <span class="ticker-match-score-box">${match.payload.val().challengerScore}</span> (${match.payload.val().defenderRank}) ${match.payload.val().defenderName} <span class="ticker-match-score-box">${match.payload.val().defenderScore}</span>`]);
        //     this.listOfMatchSnapshot.push(match.payload.val());
        //     console.log('poop', this.listOfMatchSnapshot);
        //   });
        // });

        function itemCheck(num) {
          let x = num + 1;
          if (x === textContent.length) {x = 0; }
          return x;
        }

        function nextItem() {
          const x = currentItem + 1;

          if (x === textContent.length) {currentItem = 0;
            } else {currentItem++; }

        }

        function nextDisplay() {

          const x = itemCheck(currentItem);
          if ( textContent[currentItem][0] !== textContent[x][0] ) {
            tickerSub.classList.add('ticker-hidden');
          }

          tickerText.classList.add('ticker-hidden');
          // console.log(itemCheck(currentItem));
          setTimeout(function() {
            nextItem();

            tickerSub.innerHTML = textContent[currentItem][0];
            tickerText.innerHTML = textContent[currentItem][1];
            tickerText.classList.remove('ticker-hidden');
            if (tickerSub.classList.contains('ticker-hidden')) {
              tickerSub.classList.remove('ticker-hidden');
            }
          }, 1500);

        } // end func

        tickerSub.innerHTML = textContent[0][0];
        tickerText.innerHTML = textContent[0][1];

        setInterval(nextDisplay, 4000);
    }

 }
