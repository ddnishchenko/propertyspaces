import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjxDirective } from './subjx.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    SubjxDirective
  ],
  exports: [SubjxDirective]
})
export class SubjxModule {}
