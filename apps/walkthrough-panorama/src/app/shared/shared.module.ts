import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectFormDirective } from './directives/connect-form.directive';
import { SafePipe } from './pipes/safe.pipe';


import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { NgxMasonryModule } from 'ngx-masonry';
import { DndModule } from 'ngx-drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrderModule } from 'ngx-order-pipe';


import { GalleryEditorComponent } from './components/gallery-editor/gallery-editor.component';
import { AgmCoreModule } from '@agm/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryPipe } from './pipes/gallery.pipe';


@NgModule({
  declarations: [
    ConnectFormDirective,
    SafePipe,
    GalleryEditorComponent,
    GalleryPipe
  ],
  exports: [
    ConnectFormDirective,
    SafePipe,
    GalleryPipe,
    GalleryModule,
    LightboxModule,
    NgxMasonryModule,
    AgmCoreModule,
    NgbTooltipModule,
    GalleryEditorComponent,
    OrderModule
  ],
  imports: [
    CommonModule,
    GalleryModule,
    LightboxModule,
    NgxMasonryModule,
    DndModule,
    OrderModule
  ]
})
export class SharedModule { }
