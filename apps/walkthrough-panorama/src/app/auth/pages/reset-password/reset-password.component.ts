import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { resetPassword } from '../../../core/state/core.actions';
import { equalityValidator, VALIDATORS_OF_PASSWORD } from '../../../utils/validators';

@Component({
  selector: 'propertyspaces-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form;

  get passwordIsInvalid() {
    return this.fieldIsInvalid('password');
  }

  get passwordConfirmationIsInvalid() {
    return this.fieldIsInvalid('passwordConfirmation');
  }

  get isFormInvalid() {
    return this.passwordIsInvalid || this.passwordConfirmationIsInvalid;
  }

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl('', VALIDATORS_OF_PASSWORD),
      passwordConfirmation: new FormControl('', VALIDATORS_OF_PASSWORD.concat([equalityValidator('password')])),
      resetToken: new FormControl(this.route.snapshot.queryParams.resetToken, Validators.required)
    });

  }

  private fieldIsInvalid(name: string) {
    const f = this.form.get(name);
    return f.errors && f.touched;
  }

  resetPassword() {
    this.store.dispatch(resetPassword({ data: this.form.value }));
  }

}
