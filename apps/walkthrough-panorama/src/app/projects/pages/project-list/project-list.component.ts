import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import { ProjectsService } from '../../service/projects.service';

@Component({
  selector: 'propertyspaces-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects$;
  projectIds = [];
  constructor(
    private modalService: NgbModal,
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.projects$ = this.projectsService.getProjects();
  }

  openCreateForm() {
    const modalRef = this.modalService.open(ProjectFormComponent, {
      size: 'lg'
    });
    modalRef.result.then(value => {
      if (value) {
        // Create project
        this.projectsService.createProject(value).subscribe(res => {
          console.log(res);
          this.init();
        })
      }
    })
  }

  deleteProjects() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.msg = 'Are you sure you want to delete these projects?';
    modalRef.result.then(value => {
      if (value) {
        // Delete projects
        alert(`Projects with ids (${this.projectIds.join(', ')}) has been deleted.`);
      }
    });
  }

  onCheckChange($event) {
    const v = $event.target.value;
    if (this.projectIds.includes(v) ) {
      this.projectIds = this.projectIds.filter(id => id !== v);
    } else {
      this.projectIds = [
        ...this.projectIds,
        v
      ];
    }
  }

}
