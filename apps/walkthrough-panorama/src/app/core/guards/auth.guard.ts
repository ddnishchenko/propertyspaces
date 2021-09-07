import { Injectable } from "@angular/core";
import { CanActivate, CanLoad, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  private get isAuthenticated() {
    return !!this.authService.accessToken;
  }
  private checkAuth() {
    if (!this.isAuthenticated) {
      this.router.navigate(['auth'])
    }
  }
  canActivate(route, state) {
    this.checkAuth();
    return this.isAuthenticated;
  }
  canLoad(route, segments) {
    this.checkAuth();
    return this.isAuthenticated;
  }
}
