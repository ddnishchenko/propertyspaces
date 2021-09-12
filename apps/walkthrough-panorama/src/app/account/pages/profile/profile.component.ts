import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { skip } from 'rxjs';
import { logout } from '../../../core/state/core.actions';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { deleteAccount, loadAccount, updateAccount } from '../../state/account.actions';
import { selectAccount } from '../../state/account.selectors';

@Component({
  selector: 'propertyspaces-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile$;
  form = new FormGroup({
    avatar: new FormControl(),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
  });
  constructor(
    private store: Store,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(loadAccount());
    this.profile$ = this.store.pipe(
      select(selectAccount),
      // skip(1)
    );
  }
  save() {
    this.store.dispatch(updateAccount({ data: this.form.value }));
  }
  deleteProfile() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Are you sure you want to delete your account?';
    modalRef.componentInstance.msg = 'All of your projects will be deleted without the ability to restore them.';
    modalRef.result.then(value => {
      if (value) {
        this.store.dispatch(deleteAccount());
      }
    });
  }
  logout() {
    this.store.dispatch(logout());
  }
}
