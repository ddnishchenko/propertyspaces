import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate, CanLoad {
  private get isGuest() {
    return !this.authService.accessToken;
  }
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private canDo() {
    if (!this.isGuest) {
      this.router.navigate(['/account'])
    }
    return this.isGuest;
  }

  canActivate(route, state) {
    return this.canDo();
  }
  canLoad(route, segments) {
    return this.canDo();
  }
}
