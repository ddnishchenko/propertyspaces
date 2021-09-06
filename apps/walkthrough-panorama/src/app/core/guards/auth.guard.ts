import { Injectable } from "@angular/core";
import { CanActivate, CanLoad } from "@angular/router";
import { AuthService } from "../../services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService) { }
  private get isAuthenticated() {
    return !!this.authService.accessToken;
  }
  canActivate(route, state) {
    return this.isAuthenticated;
  }
  canLoad(route, segments) {
    return this.isAuthenticated;
  }
}
