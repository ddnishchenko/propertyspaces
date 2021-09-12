import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction(
  '[Users] Load Users'
);

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ data: any }>()
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: any }>()
);

export const loadUser = createAction(
  '[Users] Load User',
  props<{ id: string; }>()
);

export const loadUserSuccess = createAction(
  '[Users] Load User Success',
  props<{ data: any }>()
);

export const loadUserFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: any }>()
);

export const updateUser = createAction(
  '[Users] Update User',
  props<{ id: string; data: any }>()
);

export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ data: any }>()
);

export const updateUserFailure = createAction(
  '[Users] Update Users Failure',
  props<{ error: any }>()
);

export const deleteUser = createAction(
  '[Users] Delete User',
  props<{ id: string; data: any }>()
);

export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ id: string; }>()
);

export const deleteUserFailure = createAction(
  '[Users] Delete Users Failure',
  props<{ error: any }>()
);
