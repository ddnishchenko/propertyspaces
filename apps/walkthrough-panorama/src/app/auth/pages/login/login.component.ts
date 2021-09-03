import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.authService.login(this.form.value)
      .subscribe(() => this.router.navigate(['/account']))
  }

}
