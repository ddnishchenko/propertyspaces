import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import { ProjectsService } from '../../service/projects.service';
import { copyProject, createProject, deleteProjects, loadProjects } from '../../state/projects.actions';
import { selectProjects } from '../../state/projects.selectors';

@Component({
  selector: 'propertyspaces-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projectIds = [];
  projects$ = this.store.pipe(
    select(selectProjects)
  );
  constructor(
    private modalService: NgbModal,
    private projectsService: ProjectsService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(loadProjects());
  }

  openCreateForm() {
    const modalRef = this.modalService.open(ProjectFormComponent, {
      size: 'lg'
    });
    modalRef.result.then(value => {
      if (value) {
        this.store.dispatch(createProject(value))
      }
    })
  }

  deleteProjects(projectId?) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.msg = 'Are you sure you want to delete these projects?';
    modalRef.result.then(value => {
      if (value) {
        const projectIds = projectId ? [projectId] : this.projectIds;
        this.store.dispatch(deleteProjects({projectIds}));
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

  copyProject(id) {
    this.store.dispatch(copyProject({projectId: id}));
  }

}
