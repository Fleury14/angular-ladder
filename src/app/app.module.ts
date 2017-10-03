import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

import { ContactComponent } from './sub-pages/contact/contact.component';
import { AboutComponent } from './sub-pages/about/about.component';
import { RulesComponent } from './sub-pages/rules/rules.component';
import { ChallengeComponent } from './sub-pages/challenges/challenge.component';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
},
{
  path: 'contact',
  component: ContactComponent
},
{
  path: 'about',
  component: AboutComponent
},
{
  path: 'rules',
  component: RulesComponent
},
{
  path: 'challenges',
  component: ChallengeComponent
},
{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}
];

@NgModule({
  declarations: [
    AppComponent, NavComponent, FooterComponent, HomeComponent, ContactComponent, AboutComponent, RulesComponent, ChallengeComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
