import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { map, mergeMap, tap } from "rxjs/operators";
import { AuthService } from "../../services/auth.service";
import * as CoreActions from './core.actions';

@Injectable()
export class CoreEffects {

  register$ = createEffect(() => this.actions$.pipe(
    ofType(CoreActions.register),
    mergeMap(
      payload => this.authService.register(payload.user).pipe(
        map(() => {
          this.router.navigate(['/auth'])
          return CoreActions.registerSuccess()
        })
      )
    )
  ),
    { dispatch: false }
  );

  login$ = createEffect(() => this.actions$.pipe(
    ofType(CoreActions.login),
    mergeMap(
      payload => this.authService.login(payload.credentials).pipe(
        map(res => {
          this.router.navigate(['/account'])
          return CoreActions.loginSuccess({ accessToken: res.accessToken })
        })
      )
    )
  ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () => this.actions$.pipe(
      ofType(CoreActions.logout),
      mergeMap(
        () => this.authService.logout().pipe(
          tap(() => this.router.navigate(['/auth']))
        )
      )
    ),
    { dispatch: false }
  )

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) { }
}
