import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Observable, skip } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { logout } from '../../../core/state/core.actions';
import { Project } from '../../../interfaces/project';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ContactInfoModalComponent } from '../../components/contact-info-modal/contact-info-modal.component';
import { MapModalComponent } from '../../components/map-modal/map-modal.component';
import { PanoramaFormComponent } from '../../components/panorama-form/panorama-form.component';
import { activateProject, buildProject, deactivateProject, deletePanorama, deleteProjects, loadProject, updatePanorama, updateProject } from '../../state/projects.actions';
import { selectProject } from '../../state/projects.selectors';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'propertyspaces-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  host = environment.apiHost;
  isMenuCollapsed = true;
  project$: Observable<Project> = this.store.pipe(select(selectProject));
  panoNames = [];
  isEditName = false;
  projectName;
  compressedImage
  isMobileApp = this.authService.isMobileApp;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  numbersComparator(itemA, itemB) {
    return parseInt(itemA, 10) > parseInt(itemB, 10) ? 1 : -1;
  }

  openCreateForm(project) {
    const modalRef = this.modalService.open(PanoramaFormComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.title = 'Create Panorama';
    modalRef.componentInstance.pano = {};
    modalRef.componentInstance.project = project;
    modalRef.result.then(value => {
      if (value) {
        // Edit Pano
        this.store.dispatch(updatePanorama({ projectId: this.route.snapshot.params.id, panorama: value }))
      }
    });
  }

  openEditPanorama(project, panorama) {
    const modalRef = this.modalService.open(PanoramaFormComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.title = 'Edit Panorama';
    modalRef.componentInstance.pano = panorama;
    modalRef.componentInstance.project = project;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then(value => {
      if (value) {
        // Edit Pano
        this.store.dispatch(updatePanorama({ projectId: this.route.snapshot.params.id, panorama: value }))
      }
    });
  }

  deletePanoramas(pano) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.msg = 'Are you sure you want to delete these projects?';
    modalRef.result.then(value => {
      if (value) {
        // Delete projects
        const panoramas = [pano];
        this.store.dispatch(deletePanorama({ panoramas, projectId: this.route.snapshot.params.id }));
      }
    });
  }

  editName(projectName) {
    this.isEditName = true;
    this.projectName = projectName;
  }

  saveName(project: Project) {
    this.store.dispatch(updateProject({ projectId: project.id, project: { name: this.projectName } }));
    this.isEditName = false;
  }

  openMapModal(project) {
    const modal = this.modalService.open(MapModalComponent, { size: 'lg' });
    modal.componentInstance.data = project.addr || {};
    modal.result.then(
      res => this.store.dispatch(updateProject({ projectId: project.id, project: { addr: res } })),
    );
  }

  openContactModal(project_id) {
    const modal = this.modalService.open(ContactInfoModalComponent, { size: 'lg' });
    modal.componentInstance.project_id = project_id;
  }

  openGalleryModal(tpl) {
    const modal = this.modalService.open(tpl, { windowClass: 'fullscreen-modal' });
  }

  deleteProject(id) {
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.title = `Are you sure?`;
    modal.result.then((v) => {
      if (v) {
        this.store.dispatch(deleteProjects({ projectIds: [id] }));
        this.router.navigate(['/projects']);
      }
    })
  }

  imageNameChanged($event, projectId) {
    console.log({ ...$event, projectId });
    // this.store.dispatch(renamePhoto({ ...$event, projectId }));
  }
  sortChanged($event, projectId) {
    console.log({ projectId, photos: $event });
    // this.store.dispatch(changeOrderOfPhoto({ projectId, photos: $event.map(item => item.name) }))
  }
  deleteGalleryImage($event, projectId) {
    // this.store.dispatch(removeProjectGalleryPhoto({ projectId, image_id: [$event.item.name] }));
  }

  logout() {
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.title = 'Are you sure?';
    modal.result.then(res => {
      if (res) {
        this.store.dispatch(logout())
      }
    })
  }
  buildProject(id) {
    this.store.dispatch(buildProject({ projectId: id }));
  }
  changeStatus(project) {
    const action = project.active ? deactivateProject({ projectId: project.id }) : activateProject({ projectId: project.id });
    this.store.dispatch(action);
  }
}
