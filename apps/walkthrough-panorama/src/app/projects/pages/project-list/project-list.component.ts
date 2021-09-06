import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { logout } from '../../../core/state/core.actions';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import { createProject, deleteProjects, loadProjects } from '../../state/projects.actions';
import { selectProjects } from '../../state/projects.selectors';

@Component({
  selector: 'propertyspaces-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  isMenuCollapsed = true;
  projectIds = [];
  projects$ = this.store.pipe(select(selectProjects));
  constructor(
    private modalService: NgbModal,
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
        this.store.dispatch(createProject({ project: value }))
      }
    })
  }

  deleteProjects(projectId?) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.msg = 'Are you sure you want to delete these projects?';
    modalRef.result.then(value => {
      if (value) {
        const projectIds = projectId ? [projectId] : this.projectIds;
        this.store.dispatch(deleteProjects({ projectIds }));
      }
    });
  }

  onCheckChange($event) {
    const v = $event.target.value;
    if (this.projectIds.includes(v)) {
      this.projectIds = this.projectIds.filter(id => id !== v);
    } else {
      this.projectIds = [
        ...this.projectIds,
        v
      ];
    }
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

}
