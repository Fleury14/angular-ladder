import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule, RoutingComponents } from './admin.routing.module';

import { NewsService } from './../../services/news-service';


@NgModule({
    declarations: [ RoutingComponents ],
    imports: [ CommonModule, AdminRoutingModule ],
    providers: [ NewsService ]
})

export class AdminModule {}
