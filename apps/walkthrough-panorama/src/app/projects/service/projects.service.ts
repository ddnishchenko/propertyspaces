import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

const host = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private http: HttpClient
  ) { }

  createProject(project) {
    return this.http.post(host + 'create-panoramas-project', {client_id: 1295, ...project});
  }

  getProjects() {
    return this.http.post(host + 'get-panoramas-projects', {client_id: 1295});
  }

  getProject(project_id) {
    return this.http.post(host + 'get-panoramas-project', {client_id: 1295, project_id});
  }

  getPanoramas(project_id) {
    const params = new HttpParams({fromObject: {project_id}});
    return this.http.get(host + 'get-panoramas',{params});
  }

  createPanorama(project_id, panorama_data) {
    return this.http.post(host + 'create-panorama', {project_id, panorama_data});
  }
}
