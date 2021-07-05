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
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgScrollbarModule } from 'ngx-scrollbar';


import { GalleryEditorComponent } from './components/gallery-editor/gallery-editor.component';
import { AgmCoreModule } from '@agm/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryPipe } from './pipes/gallery.pipe';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { GoogleStreetViewDirective } from './directives/google-street-view.directive';
import { ImageGridComponent } from './components/image-grid/image-grid.component';
import { SliderComponent } from './components/slider/slider.component';
import { SliderMinusDirective, SliderPlusDirective } from './components/slider/slider.directives';
import { GoogleAutocompleteDirective } from './directives/google-autocomplete.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConnectFormDirective,
    SafePipe,
    GalleryEditorComponent,
    ConfirmationModalComponent,
    GalleryPipe,
    GoogleStreetViewDirective,
    ImageGridComponent,
    SliderComponent,
    SliderMinusDirective,
    SliderPlusDirective,
    GoogleAutocompleteDirective
  ],
  exports: [
    ConnectFormDirective,
    GoogleStreetViewDirective,
    SafePipe,
    GalleryPipe,
    GalleryModule,
    LightboxModule,
    NgxMasonryModule,
    AgmCoreModule,
    NgbTooltipModule,
    GalleryEditorComponent,
    ConfirmationModalComponent,
    OrderModule,
    AngularSvgIconModule,
    SliderComponent,
    SliderMinusDirective,
    SliderPlusDirective,
    NgScrollbarModule,
    GoogleAutocompleteDirective,
    ReactiveFormsModule,
    FormsModule,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GalleryModule,
    LightboxModule,
    NgxMasonryModule,
    DndModule,
    OrderModule,
    AngularSvgIconModule,
    NgScrollbarModule
  ]
})
export class SharedModule { }
