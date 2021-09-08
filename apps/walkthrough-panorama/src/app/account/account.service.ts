import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const api = environment.apiHost;
const endpoint = `${api}users/profile`;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get(endpoint)
  }

  updateProfile(body) {
    return this.http.patch(endpoint, body);
  }

  deleteProfile() {
    return this.http.delete(endpoint)
  }

}
