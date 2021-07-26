import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryPipe } from './pipes/gallery.pipe';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    GalleryPipe,
    SafePipe
  ],
  exports: [
    GalleryPipe,
    SafePipe
  ]
})
export class PipesModule {}
