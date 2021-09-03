import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
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
    passwordConfirmation: new FormControl('', VALIDATORS_OF_PASSWORD.concat([equalityValidator('password')])),
    termsCheck: new FormControl(false, [Validators.requiredTrue])
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

  get termsCheckIsInvalid() {
    return this.fieldIsInvalid('termsCheck');
  }

  get isFormInvalid() {
    return this.emailIsInvalid || this.passwordIsInvalid || this.passwordConfirmationIsInvalid || this.termsCheckIsInvalid;
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private fieldIsInvalid(name: string) {
    const f = this.form.get(name);
    return f.errors && f.touched;
  }

  register() {
    this.authService.register(this.form.value)
      .subscribe(() => this.router.navigate(['/auth']));
  }
}
