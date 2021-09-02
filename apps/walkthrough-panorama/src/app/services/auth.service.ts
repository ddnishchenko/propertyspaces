import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
const api = environment.apiHost;

const storePrefix = '_auth_';
const tokenKey = `${storePrefix}_token`;
const userKey = `${storePrefix}_user`;
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

  constructor(private http: HttpClient) { }

  register(user) {
    return this.http.post(`${api}/auth/register`, user);
  }

  login(creds) {
    return this.http.post(`${api}/auth/login`, creds).pipe(
      map((data: { accessToken: string }) => this.accessToken = data.accessToken)
    );
  }

  logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  }

}
