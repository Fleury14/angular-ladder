import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { ContactComponent } from './sub-pages/contact/contact.component';
import { AboutComponent } from './sub-pages/about/about.component';
import { RulesComponent } from './sub-pages/rules/rules.component';
import { ChallengeComponent } from './sub-pages/challenges/challenge.component';
import { MatchHistoryComponent } from './sub-pages/match-history/match-history.component';
import { StandingsComponent } from './sub-pages/standings/standings.component';
import { MissingPageComponent } from './sub-pages/error/missing-page.component';
import { AdminComponent } from './sub-pages/admin/admin.component';
import { JoinComponent } from './sub-pages/join/join.component';
import { DashboardComponent } from './sub-pages/dashboard/dashboard.component';
import { PlaceChallengeComponent } from './sub-pages/place-challenge/place-challenge.component';
import { SubmitComponent } from './sub-pages/submitted/submitted.component';

import { LoggedInRouterGuard } from './services/logged-in-router-guard.service';


const routes: Routes = [{
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'admin',
    component: AdminComponent
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
    path: 'match-history',
    component: MatchHistoryComponent
  },
  {
    path: 'standings',
    component: StandingsComponent
  },
  {
    path: 'join',
    component: JoinComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ LoggedInRouterGuard ]
  },
  {
    path: 'place-challenge',
    component: PlaceChallengeComponent
  },
  {
    path: 'submit',
    component: SubmitComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: MissingPageComponent
  }
  ];

@NgModule({
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule ],
    providers: [ LoggedInRouterGuard ]
  })

export class MainRoutingModule {}

export const MainRoutingComponents = [ HomeComponent, AboutComponent, ContactComponent, RulesComponent, ChallengeComponent,
    MatchHistoryComponent, StandingsComponent, MissingPageComponent, AdminComponent, JoinComponent, DashboardComponent,
    PlaceChallengeComponent, SubmitComponent];

