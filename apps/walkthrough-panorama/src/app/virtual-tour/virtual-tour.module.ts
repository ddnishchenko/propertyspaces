import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VirtualTourRoutingModule } from './virtual-tour-routing.module';
import { VirtualTourComponent } from './virtual-tour.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// ngrx
import * as fromProjects from '../projects/state/projects.reducer';
import { ProjectsEffects } from '../projects/state/projects.effects';


@NgModule({
  declarations: [
    VirtualTourComponent
  ],
  imports: [
    CommonModule,
    VirtualTourRoutingModule,
    NgbCollapseModule,
    StoreModule.forFeature(fromProjects.projectsFeatureKey, fromProjects.reducer),
    EffectsModule.forFeature([ProjectsEffects]),
  ]
})
export class VirtualTourModule { }
