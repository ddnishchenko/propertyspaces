import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as UsersActions from './users.actions';
import { UsersService } from '../../services/users.service';



@Injectable()
export class UsersEffects {

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(UsersActions.loadUsers),
      mergeMap(
        () => this.usersService.getUsers().pipe(
          map(data => UsersActions.loadUsersSuccess({ data }))
        )
      )
    );
  });

  loadUser$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(UsersActions.loadUser),
      mergeMap(
        (payload) => this.usersService.getUser(payload.id).pipe(
          map(data => UsersActions.loadUserSuccess({ data }))
        )
      )
    );
  });

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(UsersActions.updateUser),
      mergeMap(
        (payload) => this.usersService.updateUser(payload.id, payload.data).pipe(
          map(data => UsersActions.updateUserSuccess({ data }))
        )
      )
    );
  });

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(UsersActions.deleteUser),
      mergeMap(
        (payload) => this.usersService.deleteUser(payload.id, payload.data).pipe(
          map(() => UsersActions.deleteUserSuccess({ id: payload.id }))
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private usersService: UsersService
  ) { }

}
