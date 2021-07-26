import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PipesModule } from '@propertyspaces/pipes';
import { SvgZoomPanModule } from '@propertyspaces/svgzoompan';

import { FloorplanComponent } from './floorplan/floorplan.component';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    SvgZoomPanModule
  ],
  declarations: [
    FloorplanComponent
  ],
  exports: [
    FloorplanComponent
  ]
})
export class FloorplanModule {}
