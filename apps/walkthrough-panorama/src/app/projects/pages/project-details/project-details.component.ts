import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { environment } from 'apps/walkthrough-panorama/src/environments/environment';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ContactInfoModalComponent } from '../../components/contact-info-modal/contact-info-modal.component';
import { GalleryModalComponent } from '../../components/gallery-modal/gallery-modal.component';
import { MapModalComponent } from '../../components/map-modal/map-modal.component';
import { PanoramaFormComponent } from '../../components/panorama-form/panorama-form.component';
import { deletePanorama, editProject, loadPanoramas, updateAddressData, updatePanorama } from '../../state/projects.actions';
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
  panoNames = [];
  isEditName = false;
  projectName;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(loadPanoramas({ projectId: this.route.snapshot.params.id }));
    this.project$ = this.store.pipe(select(selectVirtualTourParams));
    this.panoramas$ = this.store.pipe(select(selectHdrVirtualTourPanoramas));
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
    modal.componentInstance.project = project.project;
    modal.result.then(
      reslove => this.store.dispatch(updateAddressData({ projectId: project.project_id, data: reslove })),
      reject => { }
    );
  }

  openContactModal(project_id) {
    const modal = this.modalService.open(ContactInfoModalComponent, { size: 'lg' });
    modal.componentInstance.project_id = project_id;
  }

  openGalleryModal(project_id) {
    const modal = this.modalService.open(GalleryModalComponent, { size: 'xl' });
    modal.componentInstance.project_id = project_id;
  }
}
