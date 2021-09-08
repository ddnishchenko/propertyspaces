import { createAction, props } from '@ngrx/store';

export const loadAccount = createAction(
  '[Account] Load Accounts'
);

export const loadAccountSuccess = createAction(
  '[Account] Load Accounts Success',
  props<{ data: any }>()
);

export const loadAccountFailure = createAction(
  '[Account] Load Accounts Failure',
  props<{ error: any }>()
);

export const updateAccount = createAction(
  '[Account] Update Accounts',
  props<{ data: any }>()
);

export const updateAccountSuccess = createAction(
  '[Account] Update Accounts Success',
  props<{ data: any }>()
);

export const updateAccountFailure = createAction(
  '[Account] Update Accounts Failure',
  props<{ error: any }>()
);

export const deleteAccount = createAction(
  '[Account] Delete Accounts'
);

export const deleteAccountSuccess = createAction(
  '[Account] Delete Accounts Success'
);

export const deleteAccountFailure = createAction(
  '[Account] Delete Accounts Failure',
  props<{ error: any }>()
);
