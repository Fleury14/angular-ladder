import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRoutingModule, NewsRoutingComponents } from './news-management.routing.module';

@NgModule({
    declarations: [ NewsRoutingComponents ],
    imports: [ CommonModule, NewsRoutingModule ]
})

export class NewsManagementModule {}
