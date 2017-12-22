import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule, RoutingComponents } from './admin.routing.module';
import { FormsModule } from '@angular/forms';

// import { NewsManagementModule } from './news-management/news-management.module';

import { NewsService } from './../../services/news-service';
import { NewsDatabaseService } from './../../services/database/news-databse.service';
import { LadderDatabaseService } from './../../services/database/ladder-database.service';


@NgModule({
    declarations: [ RoutingComponents ],
    imports: [ CommonModule, FormsModule, AdminRoutingModule ],
    providers: [ NewsService, NewsDatabaseService, LadderDatabaseService ]
})

export class AdminModule {}
