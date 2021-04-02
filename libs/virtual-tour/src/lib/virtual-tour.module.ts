import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualTourDirective } from './virtual-tour.directive';

@NgModule({
  declarations: [VirtualTourDirective],
  exports: [VirtualTourDirective],
  imports: [CommonModule],
})
export class VirtualTourModule {}
