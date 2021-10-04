import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { loadProject } from '../state/projects.actions';
import { selectProject } from '../state/projects.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<any> {
  constructor(private store: Store) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.store.dispatch(loadProject({ projectId: route.params.id }));
    return this.waitForProjectsToLoad();
  }

  waitForProjectsToLoad() {
    return this.store.pipe(
      select(selectProject),
      filter(project => !!project),
      take(1)
    );
  }
}
