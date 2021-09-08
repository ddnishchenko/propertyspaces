import { Action, createReducer, on } from '@ngrx/store';
import * as AccountActions from './account.actions';

export const accountFeatureKey = 'account';

export interface State {
  account: any;
}

export const initialState: State = {
  account: {}
};


export const reducer = createReducer(
  initialState,
  on(AccountActions.loadAccountSuccess, (state, action) => ({
    ...state,
    account: action.data
  })),
  on(AccountActions.updateAccountSuccess, (state, action) => ({
    ...state,
    account: {
      ...state.account,
      ...action.data
    }
  })),
  on(AccountActions.deleteAccountSuccess, (state, action) => ({ ...state, account: {} })),
);

