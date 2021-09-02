import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const api = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class AwsServiceService {

  constructor(private http: HttpClient) { }

  listProjects() {
    return this.http.get(`${api}/projects`);
  }

  createProject(body): Observable<any> {
    return this.http.post(`${api}projects`, body);
  }

  getProject(id) {
    return this.http.get(`${api}projects/${id}`);
  }

  updateProject(id, body) {
    return this.http.put(`${api}projects/${id}`, body);
  }

  copyProject(id) {
    return this.http.post(`${api}project/${id}`, { copy: true });
  }

  deleteProject(id) {
    return this.http.delete(`${api}projects/${id}`);
  }

  // pano


}
