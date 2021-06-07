import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanoramaPlayerRoutingModule } from './panorama-player-routing.module';
import { PanoramaPlayerComponent } from './panorama-player.component';

import { VirtualTourModule } from '@propertyspaces/virtual-tour';
import { DragResizeModule } from '@propertyspaces/drag-resize';
import { SubjxModule } from '@propertyspaces/subjx';
import { ReactiveFormsModule } from '@angular/forms';
import { FloorplanEditorComponent } from './components/floorplan-editor/floorplan-editor.component';
import { NgbAccordionModule, NgbButtonsModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PanoramaPlayerComponent, FloorplanEditorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanoramaPlayerRoutingModule,
    VirtualTourModule,
    DragResizeModule,
    SubjxModule,
    NgbNavModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NgbAccordionModule
  ]
})
export class PanoramaPlayerModule { }
