import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../../core/state/core.actions';
import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'propertyspaces-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
  });
  constructor(
    private usersService: UsersService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.usersService.getProfile().subscribe(user => {
      this.form.patchValue(user);
    })
  }
  save() {
    this.usersService.updateProfile(this.form.value).subscribe(user => {
      console.log(user);
    })
  }
  logout() {
    this.store.dispatch(logout());
  }
}
