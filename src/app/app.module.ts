import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MainRoutingModule, MainRoutingComponents } from './app.routing.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';


import { TwitchStatusService } from './services/twitch-status.service';
import { LadderService } from './services/ladder.service';


@NgModule({
  declarations: [
    AppComponent, NavComponent, FooterComponent, MainRoutingComponents
  ],
  imports: [
    BrowserModule, MainRoutingModule, HttpModule
  ],
  providers: [ TwitchStatusService, LadderService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
