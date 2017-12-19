import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NewsRoutingModule, NewsRoutingComponents } from './news-management.routing.module';
import { FormsModule } from '@angular/forms';

import { NewsDatabaseService } from './../../../services/database/news-databse.service';

@NgModule({
    declarations: [ ],
    imports: [ CommonModule, FormsModule ],
    providers: [ NewsDatabaseService ]
})

export class NewsManagementModule {}
