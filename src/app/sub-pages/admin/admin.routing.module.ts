import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { RouterGuard } from './../../services/router-guard.service';

import { NewsManagementComponent } from './news-management/news-management.component';
import { ChallengeManagementComponent } from './challenge-management/challenge-management.component';
import { PlayerManagementComponent } from './player-management/player-management.component';
import { PendingManagementComponent } from './pending-management/pending-management.component';
import { LinkManagementComponent } from './link-management/link-management.component';

const routes: Routes = [{
        path: 'admin',
        component: AdminComponent,
        canActivate: [ RouterGuard ],
        children: [
        {
            path: 'news',
            component: NewsManagementComponent
        },
        {
            path: 'players',
            component: PlayerManagementComponent
        },
        {
            path: 'challenges',
            component: ChallengeManagementComponent
        },
        {
            path: 'pending',
            component: PendingManagementComponent
        },
        {
            path: 'pending-link',
            component: LinkManagementComponent
        }]

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [ RouterModule ],
    providers: [ RouterGuard ]
})

export class AdminRoutingModule {}

export const RoutingComponents =  [NewsManagementComponent, PlayerManagementComponent, ChallengeManagementComponent,
    PendingManagementComponent, LinkManagementComponent];
