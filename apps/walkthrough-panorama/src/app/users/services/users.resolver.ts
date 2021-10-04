import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { loadUsers } from '../state/users.actions';
import { selectUsers } from '../state/users.selectors';

@Injectable({
  providedIn: 'root'
})
export class UsersResolver implements Resolve<any> {
  constructor(private store: Store) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.store.dispatch(loadUsers());
    return this.waitForProjectsToLoad();
  }

  waitForProjectsToLoad() {
    return this.store.pipe(
      select(selectUsers),
      filter(users => !!users.length),
      take(1)
    );
  }
}
