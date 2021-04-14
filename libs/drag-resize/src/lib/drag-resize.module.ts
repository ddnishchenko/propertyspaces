import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './draggable.directive';
import { ResizableDirective } from './resizable.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DraggableDirective,
    ResizableDirective
  ],
  exports: [
    DraggableDirective,
    ResizableDirective
  ]
})
export class DragResizeModule {}
