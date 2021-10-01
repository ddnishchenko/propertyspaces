import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
const api = environment.apiHost;
const endpoint = environment.apiHost + 'auth'
const storePrefix = '_auth_';
const tokenKey = `${storePrefix}_token`;
const userKey = `${storePrefix}_user`;
const isMobileAppKey = 'isMobileApp';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  set accessToken(token) {
    localStorage.setItem(tokenKey, token);
  }

  get accessToken() {
    return localStorage.getItem(tokenKey);
  }

  set currentUser(user) {
    localStorage.setItem(userKey, JSON.stringify(user));
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem(userKey));
  }

  set isMobileApp(value) {
    localStorage.setItem(isMobileAppKey, JSON.stringify(value));
  }

  get isMobileApp() {
    return JSON.parse(localStorage.getItem(isMobileAppKey));
  }

  constructor(private http: HttpClient) { }

  register(user) {
    return this.http.post(`${endpoint}/register`, user);
  }

  login(creds) {
    return this.http.post(`${endpoint}/login`, creds).pipe(
      tap((data: { accessToken: string; user: any; }) => {
        this.accessToken = data.accessToken;
        this.currentUser = data.user;
        this.isMobileApp = data.user.roles.includes('admin');

      })
    );
  }

  logout() {
    return this.http.get(`${endpoint}/logout`).pipe(
      tap(() => {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        localStorage.removeItem(isMobileAppKey);
      })
    );

  }

  forgotPassword(body) {
    return this.http.post(`${endpoint}/forgot-password`, body);
  }

  resetPassword(body) {
    return this.http.post(`${endpoint}/reset-password`, body);
  }

  changePassword(body: { currentPassword: string; newPassword: string }) {
    return this.http.post(`${endpoint}/change-password`, body)
  }



}
