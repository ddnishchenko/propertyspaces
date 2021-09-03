import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const api = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get(`${api}users/profile`);
  }

  updateProfile(body) {
    return this.http.patch(`${api}users/profile`, body);
  }
}
