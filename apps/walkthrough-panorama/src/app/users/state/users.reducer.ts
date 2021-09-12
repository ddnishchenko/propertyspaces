import { Action, createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';

export const usersFeatureKey = 'users';

export interface State {
  users: any[];
  user: any;
}

export const initialState: State = {
  users: [],
  user: null
};


export const reducer = createReducer(
  initialState,
  on(UsersActions.loadUsersSuccess, (state, action) => ({ ...state, users: action.data })),
  on(UsersActions.loadUserSuccess, (state, action) => ({ ...state, user: action.data })),
  on(UsersActions.updateUserSuccess, (state, action) => ({ ...state, user: { ...state.user, ...action.data } })),
  on(UsersActions.deleteUserSuccess, (state, action) => ({ ...state, users: state.users.filter(user => user.id !== action.id), user: null })),
);

