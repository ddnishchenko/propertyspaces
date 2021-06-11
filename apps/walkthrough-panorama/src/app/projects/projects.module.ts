import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 3rd parties modules
import { NgbCollapseModule, NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AgmCoreModule } from '@agm/core';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';

const ngbs = [
  NgbModalModule,
  NgbCollapseModule,
  NgbTypeaheadModule,
];

// Modules
import { SharedModule } from '../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';

// Components
import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { PanoramaFormComponent } from './components/panorama-form/panorama-form.component';
import { FloorplanFormComponent } from './components/floorplan-form/floorplan-form.component';
import { MapModalComponent } from './components/map-modal/map-modal.component';
import { ContactInfoModalComponent } from './components/contact-info-modal/contact-info-modal.component';
import { GalleryModalComponent } from './components/gallery-modal/gallery-modal.component';


// ngrx
import * as fromProjects from './state/projects.reducer';
import { ProjectsEffects } from './state/projects.effects';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectFormComponent,
    ConfirmationModalComponent,
    PanoramaFormComponent,
    FloorplanFormComponent,
    MapModalComponent,
    ContactInfoModalComponent,
    GalleryModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProjectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(fromProjects.projectsFeatureKey, fromProjects.reducer),
    EffectsModule.forFeature([ProjectsEffects]),
    AgmCoreModule,
    GalleryModule,
    LightboxModule,
    ...ngbs
  ],
  entryComponents: [
    ProjectFormComponent,
    FloorplanFormComponent,
    ConfirmationModalComponent
  ]
})
export class ProjectsModule { }
