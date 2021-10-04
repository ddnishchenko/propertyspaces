import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { logout } from '../core/state/core.actions';
import { ConfirmationModalComponent } from '../shared/components/confirmation-modal/confirmation-modal.component';
import { deleteUser } from './state/users.actions';
import { selectUsers } from './state/users.selectors';

@Component({
  selector: 'propertyspaces-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  isMenuCollapsed = true;
  users$ = this.store.pipe(select(selectUsers));
  constructor(
    private modalService: NgbModal,
    private store: Store
  ) { }

  ngOnInit(): void {
  }
  logout() {
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.title = 'Are you sure?';
    modal.result.then(res => {
      if (res) {
        this.store.dispatch(logout())
      }
    });
  }
  deleteUser(user) {
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.title = 'Are you sure?';
    modal.result.then(res => {
      if (res) {
        this.store.dispatch(deleteUser({ id: user.id, data: user }))
      }
    });
  }
}
