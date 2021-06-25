import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 3rd parties modules
import { NgbCollapseModule, NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AgmCoreModule } from '@agm/core';


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
import { PanoramaFormComponent } from './components/panorama-form/panorama-form.component';
import { FloorplanFormComponent } from './components/floorplan-form/floorplan-form.component';
import { MapModalComponent } from './components/map-modal/map-modal.component';
import { ContactInfoModalComponent } from './components/contact-info-modal/contact-info-modal.component';
import { GalleryModalComponent } from './components/gallery-modal/gallery-modal.component';


// ngrx
import * as fromProjects from './state/projects.reducer';
import { ProjectsEffects } from './state/projects.effects';
import * as fromProjectGallery from './state/gallery/project-gallery.reducer';
import { ProjectGalleryEffects } from './state/gallery/project-gallery.effects';
import * as fromProjectLocation from './state/project-location/project-location.reducer';
import { ProjectLocationEffects } from './state/project-location/project-location.effects';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectFormComponent,
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
    EffectsModule.forFeature([ProjectsEffects, ProjectGalleryEffects, ProjectLocationEffects]),
    ...ngbs,
    StoreModule.forFeature(fromProjectGallery.projectGalleryFeatureKey, fromProjectGallery.reducer),
    StoreModule.forFeature(fromProjectLocation.projectLocationFeatureKey, fromProjectLocation.reducer)
  ],
  entryComponents: [
    ProjectFormComponent,
    FloorplanFormComponent,
  ]
})
export class ProjectsModule { }
