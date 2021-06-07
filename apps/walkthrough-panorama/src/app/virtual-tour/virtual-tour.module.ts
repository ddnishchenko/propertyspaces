import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VirtualTourRoutingModule } from './virtual-tour-routing.module';
import { VirtualTourComponent } from './virtual-tour.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    VirtualTourComponent
  ],
  imports: [
    CommonModule,
    VirtualTourRoutingModule,
    NgbCollapseModule
  ]
})
export class VirtualTourModule { }
