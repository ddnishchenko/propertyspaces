import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { register } from '../../../core/state/core.actions';
import { equalityValidator, REQUIRED_EMAIL_VALIDATOR, VALIDATORS_OF_PASSWORD } from '../../../utils/validators';

@Component({
  selector: 'propertyspaces-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form = new FormGroup({
    email: new FormControl('', REQUIRED_EMAIL_VALIDATOR),
    password: new FormControl('', VALIDATORS_OF_PASSWORD),
    passwordConfirmation: new FormControl('', VALIDATORS_OF_PASSWORD.concat([equalityValidator('password')]))
  });

  get emailIsInvalid() {
    return this.fieldIsInvalid('email');
  }

  get passwordIsInvalid() {
    return this.fieldIsInvalid('password');
  }

  get passwordConfirmationIsInvalid() {
    return this.fieldIsInvalid('passwordConfirmation');
  }

  get isFormInvalid() {
    return this.emailIsInvalid || this.passwordIsInvalid || this.passwordConfirmationIsInvalid;
  }

  constructor(private store: Store) { }

  private fieldIsInvalid(name: string) {
    const f = this.form.get(name);
    return f.errors && f.touched;
  }

  register() {
    this.store.dispatch(register({ user: this.form.value }));
  }
}
