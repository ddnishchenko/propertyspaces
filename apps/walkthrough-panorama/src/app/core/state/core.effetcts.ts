import { Injectable } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { SnotifyService } from "ng-snotify";
import { map, mergeMap } from "rxjs/operators";
import { AuthService } from "../../services/auth.service";
import * as CoreActions from './core.actions';

@Injectable()
export class ProjectsEffects {

  register$ = this.actions$.pipe(
    ofType(CoreActions.register),
    mergeMap(
      payload => this.authService.register(payload.user).pipe(
        map(() => {
          this.router.navigate(['/auth/login'])
          return CoreActions.registerSuccess()
        })
      )
    )
  );

  login$ = this.actions$.pipe(
    ofType(CoreActions.login),
    mergeMap(
      payload => this.authService.login(payload.credentials).pipe(
        map(res => {
          this.router.navigate(['/projects'])
          return CoreActions.loginSuccess({ accessToken: res.accessToken })
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private snotifyService: SnotifyService,
    private router: Router
  ) { }
}
