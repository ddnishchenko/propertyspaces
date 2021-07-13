import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { environment } from 'apps/walkthrough-panorama/src/environments/environment';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ContactInfoModalComponent } from '../../components/contact-info-modal/contact-info-modal.component';
import { MapModalComponent } from '../../components/map-modal/map-modal.component';
import { PanoramaFormComponent } from '../../components/panorama-form/panorama-form.component';
import { changeOrderOfPhoto, loadProjectGallery, removeProjectGalleryPhoto, renamePhoto, uploadProjectGalleryPhoto } from '../../state/gallery/project-gallery.actions';
import { selectOrderedGallery } from '../../state/gallery/project-gallery.selectors';
import { deletePanorama, deleteProjects, editProject, loadPanoramas, updateAddressData, updatePanorama } from '../../state/projects.actions';
import { selectHdrVirtualTourPanoramas, selectVirtualTourParams } from '../../state/projects.selectors';

@Component({
  selector: 'propertyspaces-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  host = environment.apiHost;
  isMenuCollapsed = true;
  project$;
  panoramas$;
  gallery$;
  panoNames = [];
  isEditName = false;
  projectName;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params.id;
    this.store.dispatch(loadPanoramas({ projectId }));
    this.store.dispatch(loadProjectGallery({ projectId }));
    this.project$ = this.store.pipe(select(selectVirtualTourParams));
    this.panoramas$ = this.store.pipe(select(selectHdrVirtualTourPanoramas));
    this.gallery$ = this.store.pipe(select(selectOrderedGallery));
  }

  numbersComparator(itemA, itemB) {
    return parseInt(itemA, 10) > parseInt(itemB, 10) ? 1 : -1;
  }

  openCreateForm(panoramas) {
    const modalRef = this.modalService.open(PanoramaFormComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.title = 'Create Panorama';
    modalRef.componentInstance.pano = {};
    modalRef.componentInstance.panoData = panoramas;
    modalRef.result.then(value => {
      if (value) {
        // Edit Pano
        this.store.dispatch(updatePanorama({ projectId: this.route.snapshot.params.id, panorama: value }))
      }
    });
  }

  openEditPanorama(panorama, panoData) {
    const modalRef = this.modalService.open(PanoramaFormComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.title = 'Edit Panorama';
    modalRef.componentInstance.pano = panorama;
    modalRef.componentInstance.panoData = panoData;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then(value => {
      if (value) {
        // Edit Pano
        this.store.dispatch(updatePanorama({ projectId: this.route.snapshot.params.id, panorama: value }))
      }
    });
  }

  deletePanoramas(name?) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.msg = 'Are you sure you want to delete these projects?';
    modalRef.result.then(value => {
      if (value) {
        // Delete projects
        const names = name ? [name] : this.panoNames;
        this.store.dispatch(deletePanorama({ names, projectId: this.route.snapshot.params.id }));
      }
    });
  }

  onCheckChange($event) {
    const v = $event.target.value;
    if (this.panoNames.includes(v)) {
      this.panoNames = this.panoNames.filter(n => n !== v);
    } else {
      this.panoNames = [
        ...this.panoNames,
        v
      ];
    }
  }

  editName(projectName) {
    this.isEditName = true;
    this.projectName = projectName;
  }

  saveName(projectId) {
    this.store.dispatch(editProject({ projectId, name: this.projectName }))
  }

  openMapModal(project, panoramas) {
    const modal = this.modalService.open(MapModalComponent, { size: 'lg' });
    modal.componentInstance.project_id = project.project_id;
    modal.componentInstance.project = project;
    modal.result.then(
      reslove => this.store.dispatch(updateAddressData({ projectId: project.project_id, data: reslove })),
      reject => { }
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
        this.store.dispatch(deleteProjects({projectIds: [id]}));
        this.router.navigate(['/projects']);
      }
    })
  }

  imageNameChanged($event, projectId) {
    console.log({ ...$event, projectId });
    this.store.dispatch(renamePhoto({ ...$event, projectId }));
  }
  sortChanged($event, projectId) {
    console.log({ projectId, photos: $event });
    this.store.dispatch(changeOrderOfPhoto({ projectId, photos: $event.map(item => item.name) }))
  }
  deleteGalleryImage($event, projectId) {
    this.store.dispatch(removeProjectGalleryPhoto({ projectId, image_id: [$event.item.name] }));
  }

  uploadImage($event, projectId) {
    if ($event.target.files.length) {
      const file = $event.target.files[0];
      this.store.dispatch(uploadProjectGalleryPhoto({projectId, file}));
    }
  }

}
