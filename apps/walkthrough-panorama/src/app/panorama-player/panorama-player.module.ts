import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PanoramaPlayerRoutingModule } from './panorama-player-routing.module';
import { PanoramaPlayerComponent } from './panorama-player.component';

import { NgbAccordionModule, NgbButtonsModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizableModule } from 'angular-resizable-element';

import { VirtualTourModule } from '@propertyspaces/virtual-tour';
import { DragResizeModule } from '@propertyspaces/drag-resize';
import { SubjxModule } from '@propertyspaces/subjx';

import { FloorplanEditorComponent } from './components/floorplan-editor/floorplan-editor.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PanoramaPlayerComponent, FloorplanEditorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanoramaPlayerRoutingModule,
    VirtualTourModule,
    DragResizeModule,
    ResizableModule,
    SubjxModule,
    NgbNavModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NgbAccordionModule,
    NgbTooltipModule,
    SharedModule
  ]
})
export class PanoramaPlayerModule { }
