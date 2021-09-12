import { Injectable } from "@angular/core";
import { CanActivate, CanLoad, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  private get isAdmin() {
    return this.authService.currentUser.roles.includes('admin');
  }
  private checkAuth() {
    if (!this.isAdmin) {
      this.router.navigate(['/account'])
    }
  }
  canActivate(route, state) {
    this.checkAuth();
    return this.isAdmin;
  }
  canLoad(route, segments) {
    this.checkAuth();
    return this.isAdmin;
  }
}
