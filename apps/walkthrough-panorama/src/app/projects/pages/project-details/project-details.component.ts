import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'apps/walkthrough-panorama/src/environments/environment';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { FloorplanFormComponent } from '../../components/floorplan-form/floorplan-form.component';
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
  panoNames = [];
  isEditName = false;
  projectName;
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
    this.panoramas$ = this.projectsService.getPanoramas(id).pipe(
      map(data => {
        const allPanos = data.data;
        var panos = allPanos.filter(t => !t.name.includes('_'));
        var panosHDR = panos.map(p => {
          return {
              ...p,
              dark_pano: allPanos.find(t => t.name.includes(`${p.name}_dark`)),
              light_pano: allPanos.find(t => t.name.includes(`${p.name}_light`)),
          };
        });
        return {...data, panos: panosHDR};
      })
    );
    this.project$ = this.projectsService.getProject(id);
  }

  openCreateForm(project) {
    const modalRef = this.modalService.open(PanoramaFormComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.title = 'Create Panorama';
    modalRef.result.then(value => {
      if (value) {
        const reqs = value.map(v => this.projectsService.createPanorama(project.id, v))
        forkJoin(reqs).subscribe(res => {
          this.initData();
        });
      }
    });
  }

  openFloorplanForm(project, panoramas) {
    const modalRef = this.modalService.open(FloorplanFormComponent, {
      size: 'lg'
    });
    if (panoramas.additional_data && panoramas.additional_data['floorplan.svg']) {
      modalRef.componentInstance.floorplan = panoramas.additional_data['floorplan.svg'];
    }
    modalRef.componentInstance.mediaPath = environment.apiHost + panoramas.path

    modalRef.result.then(value => {
      if (value) {
        this.projectsService.updateDataProject(project.id, {['floorplan.svg']: value}).subscribe(res => {
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
        const id = this.route.snapshot.params.id;
        this.projectsService.updatePanorama(id, value).subscribe(res => {
          console.log(res);
          this.initData();
        });
      }
    });
  }

  deletePanoramas() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.msg = 'Are you sure you want to delete these projects?';
    modalRef.result.then(value => {
      if (value) {
        // Delete projects
        const deleteRequests = this.panoNames.map(n => this.projectsService.deletePanoramaProject(this.route.snapshot.params.id, n));
        forkJoin(deleteRequests).subscribe(res => {
          alert(`Projects with ids (${this.panoNames.join(', ')}) has been deleted.`);
          this.panoNames = [];
          this.initData();
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
    this.projectsService.editProjectName(projectId, this.projectName).subscribe(r => {
      this.isEditName = false;
      this.initData();
    });
    this.projectsService.updateRotationProject(projectId, '3.5').subscribe(res => {
      console.log(res);
    });
  }

}
