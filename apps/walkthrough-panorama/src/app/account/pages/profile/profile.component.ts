import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { logout } from '../../../core/state/core.actions';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { deleteAccount, updateAccount } from '../../state/account.actions';

@Component({
  selector: 'propertyspaces-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form;
  profile;
  constructor(
    private store: Store,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createForm(this.route.snapshot.data.profile)
  }

  createForm(data) {
    this.profile = data;
    this.form = new FormGroup({
      avatar: new FormControl(data.avatar),
      firstName: new FormControl(data.firstName),
      lastName: new FormControl(data.lastName),
      phone: new FormControl(data.phone),
    })
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
