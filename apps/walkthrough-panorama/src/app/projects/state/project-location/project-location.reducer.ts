import { Action, createReducer, on } from '@ngrx/store';
import * as ProjectLocationActions from './project-location.actions';

export const projectLocationFeatureKey = 'projectLocation';

export interface State {

}

export const initialState: State = {

};


export const reducer = createReducer(
  initialState,

  on(ProjectLocationActions.loadProjectLocations, state => state),
  on(ProjectLocationActions.loadProjectLocationsSuccess, (state, action) => state),
  on(ProjectLocationActions.loadProjectLocationsFailure, (state, action) => state),

);

