import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MainRoutingModule, MainRoutingComponents } from './app.routing.module';
import { AdminModule } from './sub-pages/admin/admin.module';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';


import { TwitchStatusService } from './services/twitch-status.service';
import { LadderService } from './services/ladder.service';
import { MatchHistoryService } from './services/match-history.service';
import { ChallengeListService } from './services/challenge-list.service';
import { NewsService } from './services/news-service';
import { LoginService } from './services/login.service';
import { PendingDatabaseService } from './services/database/pending-database.service';
import { ChallengeDatabaseService } from './services/database/challenge-database.service';


@NgModule({
  declarations: [
    AppComponent, NavComponent, FooterComponent, MainRoutingComponents
  ],
  imports: [
    BrowserModule, AdminModule, MainRoutingModule, HttpModule, AngularFireModule.initializeApp(environment.firebase), FormsModule,
    AngularFireAuthModule, AngularFireDatabaseModule
  ],
  providers: [ TwitchStatusService, LadderService, MatchHistoryService, ChallengeListService, NewsService, LoginService,
    PendingDatabaseService, ChallengeDatabaseService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
