import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Project } from '../../../interfaces/project';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ContactInfoModalComponent } from '../../components/contact-info-modal/contact-info-modal.component';
import { MapModalComponent } from '../../components/map-modal/map-modal.component';
import { PanoramaFormComponent } from '../../components/panorama-form/panorama-form.component';
import { ProjectsService } from '../../service/projects.service';
import { deletePanorama, deleteProjects, editProject, loadProject, updateAddressData, updatePanorama } from '../../state/projects.actions';
import { selectProject } from '../../state/projects.selectors';

@Component({
  selector: 'propertyspaces-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  host = environment.apiHost;
  isMenuCollapsed = true;
  project$: Observable<Project>;
  panoNames = [];
  isEditName = false;
  projectName;
  loadImageForm: FormGroup;
  compressedImage
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params.id;
    this.store.dispatch(loadProject({ projectId }));
    this.project$ = this.store.pipe(select(selectProject));
    this.loadImageForm = new FormGroup({
      src: new FormControl(''),
      filename: new FormControl('')
    });
  }

  fileInputChanged($event) {
    this.loadImageForm.patchValue({
      filename: $event.file.name
    })
  }

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
    this.store.dispatch(editProject({ projectId: project.id, project: { ...project, name: this.projectName } }));
  }

  openMapModal(project) {
    const modal = this.modalService.open(MapModalComponent, { size: 'lg' });
    modal.componentInstance.project = project;
    modal.result.then(
      reslove => this.store.dispatch(updateAddressData({ projectId: project.id, data: reslove })),
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

  uploadImage($event, projectId) {
    if ($event.target.files.length) {
      const file = $event.target.files[0];
      // this.store.dispatch(uploadProjectGalleryPhoto({ projectId, file }));
    }
  }

}
