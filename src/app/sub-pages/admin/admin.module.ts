import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule, RoutingComponents } from './admin.routing.module';


@NgModule({
    declarations: [ RoutingComponents ],
    imports: [ CommonModule, AdminRoutingModule ]
})

export class AdminModule {}
