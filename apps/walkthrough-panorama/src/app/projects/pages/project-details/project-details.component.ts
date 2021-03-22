import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { PanoramaFormComponent } from '../../components/panorama-form/panorama-form.component';
import { ProjectsService } from '../../service/projects.service';

@Component({
  selector: 'propertyspaces-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project$;
  panoramas$;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    const id = this.route.snapshot.params.id;
    this.panoramas$ = this.projectsService.getPanoramas(id);
    this.project$ = this.projectsService.getProject(id);
  }

  openCreateForm(project) {
    const modalRef = this.modalService.open(PanoramaFormComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.title = 'Create Panorama';
    modalRef.result.then(value => {
      if (value) {
        this.projectsService.createPanorama(project.id, value).subscribe(res => {
          this.initData();
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
      }
    });
  }

  deletePanoramas() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.msg = 'Are you sure you want to delete these projects?';
    modalRef.result.then(value => {
      if (value) {
        // Delete projects
      }
    });
  }

}
