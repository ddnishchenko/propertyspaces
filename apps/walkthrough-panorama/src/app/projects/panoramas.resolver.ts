import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanoramasResolver implements Resolve<boolean> {
  constructor(private store: Store) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(true);
  }
}
