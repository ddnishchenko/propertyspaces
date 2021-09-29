import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs/operators';

import * as AccountActions from './account.actions';
import { AccountService } from '../account.service';



@Injectable()
export class AccountEffects {

  loadAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.loadAccount),
      mergeMap(
        () => this.accountService.getProfile().pipe(
          map(data => AccountActions.loadAccountSuccess({ data }))
        )
      ),
    );
  });


  updateAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.updateAccount),
      mergeMap(
        payload => this.accountService.updateProfile(payload.data).pipe(
          map(data => AccountActions.updateAccountSuccess({ data }))
        )
      ),
    );
  });

  deleteAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.deleteAccount),
      mergeMap(
        () => this.accountService.deleteProfile().pipe(
          map(() => AccountActions.deleteAccountSuccess())
        )
      ),
    );
  });

  changePassowrd$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.deleteAccount),
      mergeMap(
        () => this.accountService.deleteProfile().pipe(
          map(() => AccountActions.deleteAccountSuccess())
        )
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private accountService: AccountService
  ) { }

}
