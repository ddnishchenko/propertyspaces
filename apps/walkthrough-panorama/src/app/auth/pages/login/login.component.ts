import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../../core/state/core.actions';
import { REQUIRED_EMAIL_VALIDATOR } from '../../../utils/validators';

@Component({
  selector: 'propertyspaces-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl('', REQUIRED_EMAIL_VALIDATOR),
    password: new FormControl('', Validators.required),
  });

  constructor(private store: Store) { }

  login() {
    this.store.dispatch(login({ credentials: this.form.value }));
  }

}
