import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Project } from './interfaces/project';
import { loadProjects } from './projects/state/projects.actions';
import { ProjectsState } from './projects/state/projects.reducer';
import { selectProjectsState } from './projects/state/projects.selectors';

@Injectable({
  providedIn: 'root'
})
export class ModelDataResolver implements Resolve<ProjectsState> {

  constructor(private store: Store<ProjectsState>) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<ProjectsState> {
    const projectId = route.paramMap.get('id');
    this.store.dispatch(loadProjects())
    return this.store.pipe(
      select(selectProjectsState)
    );
  }
}
