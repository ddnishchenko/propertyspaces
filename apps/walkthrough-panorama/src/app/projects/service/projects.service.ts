import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ImageGallery } from '../../interfaces/image-gallery';
import { Panorama } from '../../interfaces/panorama';
import { Project } from '../../interfaces/project';

const endpoint = environment.apiHost + 'projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private http: HttpClient
  ) { }

  list(userId?): Observable<Project[]> {
    const params = userId ? new HttpParams({ fromObject: { user: userId } }) : undefined;
    return this.http.get<Project[]>(endpoint, { params });
  }

  create(project) {
    return this.http.post(endpoint, project);
  }

  read(id): Observable<any> {
    return this.http.get(`${endpoint}/${id}`);
  }

  update(id, project) {
    return this.http.patch(`${endpoint}/${id}`, project);
  }

  delete(id) {
    return this.http.delete(`${endpoint}/${id}`);
  }

  addPanorama(id, panorama: Panorama): Observable<Panorama[]> {
    return this.http.post<Panorama[]>(`${endpoint}/${id}/panorama`, panorama);
  }

  updatePanorama(id, panorama: Panorama): Observable<Panorama[]> {
    return this.http.put<Panorama[]>(`${endpoint}/${id}/panorama/${panorama.id}`, panorama);
  }

  deletePanorama(id, panorama: Panorama) {
    return this.http.delete(`${endpoint}/${id}/panorama/${panorama.id}`, { body: panorama });
  }

  addGalleryItem(id, photo: any): Observable<any[]> {
    return this.http.post<any[]>(`${endpoint}/${id}/gallery`, photo);
  }

  updateGalleryItem(id, photo: any): Observable<any[]> {
    return this.http.put<any[]>(`${endpoint}/${id}/gallery/${photo.id}`, photo);
  }

  deleteGalleryItem(id, photo: any) {
    return this.http.delete(`${endpoint}/${id}/gallery/${photo.id}`, { body: photo });
  }

  buildProject(id): Observable<any> {
    return this.http.get(`${endpoint}/${id}/build`);
  }

  activate(id) {
    return this.http.patch(`${endpoint}/${id}/activate`, {});
  }

  dectivate(id) {
    return this.http.patch(`${endpoint}/${id}/deactivate`, {});
  }

}
