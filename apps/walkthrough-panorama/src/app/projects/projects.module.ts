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
import { SafePipe } from '../pipes/safe.pipe';


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectFormComponent,
    ConfirmationModalComponent,
    PanoramaFormComponent,
    FloorplanFormComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ProjectFormComponent,
    FloorplanFormComponent,
    ConfirmationModalComponent
  ]
})
export class ProjectsModule { }
