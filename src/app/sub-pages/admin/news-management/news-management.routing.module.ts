import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewsManagementComponent } from './news-management.component';
import { RouterGuard } from './../../../services/router-guard.service';

import { ViewNewsComponent } from './view/view-news.component';
import { AddNewsComponent } from './add/add-news.component';
import { ChangeNewsComponent } from './change/change-news.component';

const routes: Routes = [{
        path: 'admin/news',
        component: NewsManagementComponent,
        canActivate: [ RouterGuard ],
        children: [{
            path: 'view',
            component: ViewNewsComponent
        },
        {
            path: 'add',
            component: AddNewsComponent
        },
        {
            path: 'change/:id',
            component: ChangeNewsComponent
        },
        {
            path: '',
            redirectTo: 'view',
            pathMatch: 'full'
        },
        {
            path: '**',
            component: ViewNewsComponent
        }
        ]

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [ RouterModule ],
    providers: [ RouterGuard ]
})

export class NewsRoutingModule {}

export const NewsRoutingComponents = [ ViewNewsComponent, AddNewsComponent, ChangeNewsComponent ];
