import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { PanoramaFormComponent } from './components/panorama-form/panorama-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloorplanFormComponent } from './components/floorplan-form/floorplan-form.component';
import { StoreModule } from '@ngrx/store';
import * as fromProjects from './state/projects.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProjectsEffects } from './state/projects.effects';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectFormComponent,
    ConfirmationModalComponent,
    PanoramaFormComponent,
    FloorplanFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProjectsRoutingModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(fromProjects.projectsFeatureKey, fromProjects.reducer),
    EffectsModule.forFeature([ProjectsEffects])
  ],
  entryComponents: [
    ProjectFormComponent,
    FloorplanFormComponent,
    ConfirmationModalComponent
  ]
})
export class ProjectsModule { }
