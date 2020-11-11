import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanoramaPlayerRoutingModule } from './panorama-player-routing.module';
import { PanoramaPlayerComponent } from './panorama-player.component';


@NgModule({
  declarations: [PanoramaPlayerComponent],
  imports: [
    CommonModule,
    PanoramaPlayerRoutingModule
  ]
})
export class PanoramaPlayerModule { }
