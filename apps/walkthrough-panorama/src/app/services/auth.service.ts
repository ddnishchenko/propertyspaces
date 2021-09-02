import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
const api = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(user) {
    return this.http.post(`${api}/auth/register`, user);
  }

  login(creds) {
    return this.http.post(`${api}/auth/login`, creds);
  }

  logout() {
    return this.http.get(`${api}/auth/logout`);
  }

}
