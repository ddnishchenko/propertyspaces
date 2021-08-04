import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ImageGallery } from '../../interfaces/image-gallery';
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

  getPanoramas(project_id): Observable<Project> {
    const params = new HttpParams({fromObject: {project_id}});
    return this.http.get(host + 'get-panoramas',{params}).pipe(
      mergeMap(
        panoData => this.getProject(project_id).pipe(
          map(project => ({...panoData, name: project.name, address: project.address, project}))
        )
      )
    );
  }

  createPanorama(project_id, panorama_data): Observable<Project> {
    return this.http.post(host + 'create-panorama', {project_id, panorama_data}).pipe(
      mergeMap(
        panoData => this.getProject(project_id).pipe(
          map(project => ({...panoData, name: project.name, address: project.address, project}))
        )
      )
    );
  }

  updatePanorama(project_id, panorama_data): Observable<Project> {
    return this.http.post(host  + 'update-panorama', {client_id: 1295, project_id, panorama_data}).pipe(
      mergeMap(
        panoData => this.getProject(project_id).pipe(
          map(project => ({...panoData, name: project.name, address: project.address, project}))
        )
      )
    );
  }

  deletePanoramaProject(project_id, name) {
    return this.http.post(host + 'delete-panorama-project', {client_id: 1295, project_id, name});
  }

  updateRotationProject(project_id, rotation_y) {
    return this.http.post(host + 'update-rotation-project', {client_id: 1295, project_id, rotation_y})
  }
  updateDataProject(project_id, additional_data): Observable<Project> {
    return this.http.post(host + 'update-data-project', {client_id: 1295, project_id, additional_data})
  }

  makeHdr(project_id, name): Observable<Project> {
    return this.http.post(host + 'create-hdr-panorama', {client_id: 1295, project_id, name}).pipe(
      mergeMap(
        panoData => this.getProject(project_id).pipe(
          map(project => ({...panoData, name: project.name, address: project.address}))
        )
      )
    );
  }

  uploadGalleryPhoto(project_id, file: File): Observable<ImageGallery> {
    const formData = new FormData();
    formData.append('project_id', project_id);
    formData.append('files', file);
    return this.http.post(host + 'file-image-upload', formData)
      .pipe(map((photo: any) => ({url: photo.href, thumb: photo.href, name: photo.name})));
  }

  loadGallery(project_id): Observable<any> {
    return this.http.post(host + 'project-files-list', {client_id: 1295, project_id});
  }
  removeGalleryImage(project_id, image_id) {
    return this.http.post(host + 'remove-project-file', {client_id: 1295, project_id, image_id});
  }
  changeGalleryImageName(project_id, old_name, name): Observable<any> {
    return this.http.post(host + 'change-name-project-file', {client_id: 1295, project_id, old_name, name});
  }

  updateAddress(project_id, data: any) {
    return this.http.post(host + 'project-update-addresslink', {client_id: 1295, project_id, ...data}).pipe(
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

  updateContact(project_id, additional_data): Observable<Project> {
    return this.updateDataProject(project_id, {
      ...additional_data,
      profile: JSON.stringify(additional_data.profile),
      company: JSON.stringify(additional_data.company),
    }).pipe(
      mergeMap(
        () => this.getPanoramas(project_id).pipe(
          map(data => {
            return {
              ...data,
              additional_data: {
                ...data.additional_data,
                profile: JSON.parse(data.additional_data.profile),
                company: JSON.parse(data.additional_data.company),
              }
            }
          })
        )
      )

    );
  }
}
