import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectFormDirective } from './directives/connect-form.directive';
import { SafePipe } from './pipes/safe.pipe';


import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';


@NgModule({
  declarations: [
    ConnectFormDirective,
    SafePipe
  ],
  exports: [
    ConnectFormDirective,
    SafePipe,
    GalleryModule,
    LightboxModule
  ],
  imports: [
    CommonModule,
    GalleryModule,
    LightboxModule
  ]
})
export class SharedModule { }
