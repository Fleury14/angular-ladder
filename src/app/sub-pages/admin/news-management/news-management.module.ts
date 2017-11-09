import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRoutingModule, NewsRoutingComponents } from './news-management.routing.module';

import { NewsDatabaseService } from './../../../services/database/news-databse.service';

@NgModule({
    declarations: [ NewsRoutingComponents ],
    imports: [ CommonModule, NewsRoutingModule ],
    providers: [ NewsDatabaseService ]
})

export class NewsManagementModule {}
