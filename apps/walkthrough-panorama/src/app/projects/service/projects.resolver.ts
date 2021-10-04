import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { loadProjects } from '../state/projects.actions';
import { selectProjects } from '../state/projects.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProjectsResolver implements Resolve<any> {
  constructor(private store: Store) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.store.dispatch(loadProjects());
    return this.waitForProjectsToLoad();
  }
  waitForProjectsToLoad() {
    return this.store.pipe(
      select(selectProjects),
      filter(projects => !!projects.length),
      take(1)
    );
  }
}
