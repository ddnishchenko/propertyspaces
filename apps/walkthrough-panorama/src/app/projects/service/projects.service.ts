import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ImageGallery } from '../../interfaces/image-gallery';
import { Panorama } from '../../interfaces/panorama';
import { Project } from '../../interfaces/project';

const host = environment.apiHost;
const endpoint = environment.apiHost + 'projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private http: HttpClient
  ) { }

  list(): Observable<Project[]> {
    return this.http.get<Project[]>(endpoint);
  }

  create(project) {
    return this.http.post(endpoint, project);
  }

  read(id): Observable<any> {
    return this.http.get(`${endpoint}/${id}`);
  }

  update(id, project) {
    return this.http.put(`${endpoint}/${id}`, project);
  }

  delete(id) {
    return this.http.delete(`${endpoint}/${id}`);
  }

  addPanorama(id, panorama: Panorama): Observable<Panorama> {
    return this.http.post<Panorama>(`${endpoint}/${id}/panorama`, panorama);
  }

  updatePanorama(id, panorama: Panorama) {
    return this.http.put(`${endpoint}/${id}`, panorama);
  }

  deletePanorama(project_id, name) {
    return this.http.post(host + 'delete-panorama-project', { client_id: 1295, project_id, name });
  }

  copyProject(project_id): Observable<Project> {
    return this.http.post<Project>(host + 'copy-panoramas-project', { client_id: 1295, project_id });
  }

  updateDataProject(project_id, settings): Observable<Project> {
    return this.http.post(host + 'update-data-project', { client_id: 1295, project_id, settings })
  }

  makeHdr(project_id, name): Observable<Project> {
    return this.http.post(host + 'create-hdr-panorama', { client_id: 1295, project_id, name }).pipe();
  }

  uploadGalleryPhoto(project_id, file: File): Observable<ImageGallery> {
    const formData = new FormData();
    formData.append('project_id', project_id);
    formData.append('files', file);
    return this.http.post(host + 'file-image-upload', formData)
      .pipe(map((photo: any) => ({ url: photo.href, thumb: photo.href, name: photo.name })));
  }

  loadGallery(project_id): Observable<any> {
    return this.http.post(host + 'project-files-list', { client_id: 1295, project_id });
  }
  removeGalleryImage(project_id, image_id) {
    return this.http.post(host + 'remove-project-file', { client_id: 1295, project_id, image_id });
  }
  changeGalleryImageName(project_id, old_name, name): Observable<any> {
    return this.http.post(host + 'change-name-project-file', { client_id: 1295, project_id, old_name, name });
  }

  updateAddress(project_id, data: any) {
    return this.http.post(host + 'project-update-addresslink', { client_id: 1295, project_id, ...data }).pipe(
      mergeMap(
        addr => this.updateDataProject(project_id, {
          mapEnabled: data.mapEnabled,
          streetViewEnabled: data.streetViewEnabled,
          map: data.map === '' ? null : data.map,
          streetView: data.streetView === '' ? null : data.streetView
        })
      )
    );
  }

  aws() {
    return this.http.get('https://lb5vs7eoog.execute-api.us-west-2.amazonaws.com/dev').subscribe((r) => {
      console.log(r);
    });
  }

  awsUploadFile(id, body) {
    return this.http.post(`http://localhost:3000/dev/projects/${id}/panorama`, body);
  }
}
