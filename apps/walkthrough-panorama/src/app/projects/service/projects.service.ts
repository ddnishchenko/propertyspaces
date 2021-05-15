import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Project } from '../../interfaces/project';
import { ProjectSite } from '../../interfaces/project-site';

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

  deleteProject(project_id) {
    return this.http.post(host + 'delete-panoramas-project', {client_id: 1295, project_id})
  }

  copyProject(project_id): Observable<Project> {
    return this.http.post<Project>(host + 'copy-panoramas-project', {client_id: 1295, project_id});
  }

  editProjectName(project_id, name) {
    return this.http.post(host + 'update-name-project', {client_id: 1295, project_id, name});
  }

  getProjects(): Observable<ProjectSite[]> {
    return this.http.post<ProjectSite[]>(host + 'get-panoramas-projects', {client_id: 1295});
  }

  getProject(project_id): Observable<any> {
    return this.http.post(host + 'get-panoramas-project', {client_id: 1295, project_id});
  }

  getPanoramas(project_id): Observable<any> {
    const params = new HttpParams({fromObject: {project_id}});
    return this.http.get(host + 'get-panoramas',{params});
  }

  createPanorama(project_id, panorama_data) {
    return this.http.post(host + 'create-panorama', {project_id, panorama_data});
  }

  updatePanorama(project_id, panorama_data) {
    return this.http.post(host  + 'update-panorama', {client_id: 1295, project_id, panorama_data});
  }

  deletePanoramaProject(project_id, name) {
    return this.http.post(host + 'delete-panorama-project', {client_id: 1295, project_id, name});
  }

  updateRotationProject(project_id, rotation_y) {
    return this.http.post(host + 'update-rotation-project', {client_id: 1295, project_id, rotation_y})
  }
  updateDataProject(project_id, additional_data) {
    return this.http.post(host + 'update-data-project', {client_id: 1295, project_id, additional_data})
  }

  makeHdr(project_id, name) {
    return this.http.post(host + 'create-hdr-panorama', {client_id: 1295, project_id, name})
  }
}
