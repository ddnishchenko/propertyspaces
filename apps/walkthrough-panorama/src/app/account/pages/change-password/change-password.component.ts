import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { VALIDATORS_OF_PASSWORD } from '../../../utils/validators';
import { changePassword } from '../../state/account.actions';

@Component({
  selector: 'propertyspaces-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form;
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      currentPassword: new FormControl(''),
      newPassword: new FormControl('', VALIDATORS_OF_PASSWORD)
    });
  }
  chanegPassword() {
    this.store.dispatch(changePassword(this.form.value))
  }
}
