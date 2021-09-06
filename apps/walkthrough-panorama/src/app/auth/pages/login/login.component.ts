import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../../core/state/core.actions';
import { REQUIRED_EMAIL_VALIDATOR, VALIDATORS_OF_PASSWORD } from '../../../utils/validators';

@Component({
  selector: 'propertyspaces-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl('', REQUIRED_EMAIL_VALIDATOR),
    password: new FormControl('', VALIDATORS_OF_PASSWORD),
  });

  constructor(private store: Store) { }

  login() {
    this.store.dispatch(login({ credentials: this.form.value }));
  }

}
