import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { PanoramaFormComponent } from '../../components/panorama-form/panorama-form.component';
import { ProjectsService } from '../../service/projects.service';
import { editProject, loadPanoramas } from '../../state/projects.actions';
import { selectHdrVirtualTourPanoramas, selectProjectById, selectVirtualTourParams } from '../../state/projects.selectors';

@Component({
  selector: 'propertyspaces-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project$;
  panoramas$;
  _panoramas$
  panoNames = [];
  isEditName = false;
  projectName;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(loadPanoramas({projectId: this.route.snapshot.params.id}));
    this.project$ = this.store.pipe(select(selectVirtualTourParams));
    this.panoramas$ = this.store.pipe(select(selectHdrVirtualTourPanoramas));
  }

  openCreateForm(panoramas) {
    const modalRef = this.modalService.open(PanoramaFormComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.title = 'Create Panorama';
    modalRef.componentInstance.panorama = {};
    modalRef.componentInstance.panoData = panoramas;
    modalRef.result.then(value => {
      if (value) {
        // Edit Pano
        const id = this.route.snapshot.params.id;
        this.projectsService.updatePanorama(id, value).subscribe(res => {
          console.log(res);
        });
      }
    });
  }

  openEditPanorama(panorama, panoData) {
    const modalRef = this.modalService.open(PanoramaFormComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.title = 'Edit Panorama';
    modalRef.componentInstance.panorama = panorama;
    modalRef.componentInstance.panoData = panoData;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then(value => {
      if (value) {
        // Edit Pano
        const id = this.route.snapshot.params.id;
        this.projectsService.updatePanorama(id, value).subscribe(res => {
          console.log(res);
        });
      }
    });
  }

  deletePanoramas(name?) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.msg = 'Are you sure you want to delete these projects?';
    modalRef.result.then(value => {
      if (value) {
        // Delete projects
        const deleteRequests = name ?
        [this.projectsService.deletePanoramaProject(this.route.snapshot.params.id, name)]
        :
        this.panoNames.map(n => this.projectsService.deletePanoramaProject(this.route.snapshot.params.id, n));
        forkJoin(deleteRequests).subscribe(res => {
          alert(`Projects with ids (${this.panoNames.join(', ')}) has been deleted.`);
          this.panoNames = [];
        })

      }
    });
  }

  onCheckChange($event) {
    const v = $event.target.value;
    if (this.panoNames.includes(v) ) {
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
    this.store.dispatch(editProject({projectId, name: this.projectName}))
  }

}
