import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { loadAccount } from '../state/account.actions';
import { selectAccount } from '../state/account.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<any> {
  constructor(private store: Store) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.store.dispatch(loadAccount());
    return this.waitForProfileDataToLoad();
  }

  waitForProfileDataToLoad() {
    return this.store.pipe(
      select(selectAccount),
      filter(profile => !!profile),
      take(1)
    )
  }

  initProfileData() {
    this.store.pipe(
      take(1)
    ).subscribe();
  }
}
