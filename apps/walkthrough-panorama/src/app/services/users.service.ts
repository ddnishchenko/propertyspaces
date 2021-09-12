import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const api = environment.apiHost + 'users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get(`${api}/profile`);
  }

  updateProfile(body) {
    return this.http.patch(`${api}/profile`, body);
  }

  getUsers() {
    return this.http.get(api);
  }

  getUser(id: string) {
    return this.http.get(`${api}/${id}`);
  }

  updateUser(id, body) {
    return this.http.patch(`${api}/${id}`, body);
  }

  deleteUser(id, body) {
    return this.http.delete(`${api}/${id}`, { body });
  }
}
