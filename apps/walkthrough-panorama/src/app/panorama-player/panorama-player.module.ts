import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanoramaPlayerRoutingModule } from './panorama-player-routing.module';
import { PanoramaPlayerComponent } from './panorama-player.component';

import { VirtualTourModule } from '@propertyspaces/virtual-tour';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PanoramaPlayerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanoramaPlayerRoutingModule,
    VirtualTourModule
  ]
})
export class PanoramaPlayerModule { }
