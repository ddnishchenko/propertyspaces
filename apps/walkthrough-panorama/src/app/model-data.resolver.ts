import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from './interfaces/project';
import { ProjectsService } from './projects/service/projects.service';

@Injectable({
  providedIn: 'root'
})
export class ModelDataResolver implements Resolve<Project> {

  constructor(private projectService: ProjectsService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Project> {
    const projectId = route.paramMap.get('id');
    return this.projectService.read(projectId);
  }
}
