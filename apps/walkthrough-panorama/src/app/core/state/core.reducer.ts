import {
  ActionReducer,
  ActionReducerMap,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromRouter from '@ngrx/router-store';

import { RouterStateUrl } from './urtils';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';
// import { undoRedo } from 'ngrx-undo-redo';

export interface State {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  router: fromRouter.routerReducer
};

export const getRouter = (state: State) => state.router;
export const getRouterState = createSelector(getRouter, (state: fromRouter.RouterReducerState<RouterStateUrl>) => state.state);
export const getRouteData = createSelector(getRouterState, state => state.data);

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, storeFreeze]
  : [];
