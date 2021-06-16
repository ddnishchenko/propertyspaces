import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectFormDirective } from './directives/connect-form.directive';
import { SafePipe } from './pipes/safe.pipe';


import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { NgxMasonryModule } from 'ngx-masonry';
import { DndModule } from 'ngx-drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { GalleryEditorComponent } from './components/gallery-editor/gallery-editor.component';


@NgModule({
  declarations: [
    ConnectFormDirective,
    SafePipe,
    GalleryEditorComponent
  ],
  exports: [
    ConnectFormDirective,
    SafePipe,
    GalleryModule,
    LightboxModule,
    NgxMasonryModule
  ],
  imports: [
    CommonModule,
    GalleryModule,
    LightboxModule,
    NgxMasonryModule,
    DndModule
  ]
})
export class SharedModule { }
