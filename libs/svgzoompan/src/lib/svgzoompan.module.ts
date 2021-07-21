import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgZoomPanDirective } from './svgzoompan.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    SvgZoomPanDirective
  ],
  exports: [
    SvgZoomPanDirective
  ]
})
export class SvgZoomPanModule {}
