import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { forgotPassword } from '../../../core/state/core.actions';
import { REQUIRED_EMAIL_VALIDATOR } from '../../../utils/validators';

@Component({
  selector: 'propertyspaces-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  form = new FormGroup({
    email: new FormControl('', REQUIRED_EMAIL_VALIDATOR),
  });

  constructor(private store: Store) { }

  forgotPassword() {
    this.store.dispatch(forgotPassword(this.form.value));
  }
}
