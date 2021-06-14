import { createAction, props } from '@ngrx/store';

const p = '[ProjectLocation]'

export const loadProjectLocations = createAction(
  `${p} Load ProjectLocations`
);

export const loadProjectLocationsSuccess = createAction(
  `${p} Load ProjectLocations Success`,
  props<{ data: any }>()
);

export const loadProjectLocationsFailure = createAction(
  `${p} Load ProjectLocations Failure`,
  props<{ error: any }>()
);

export const saveProjectLocations = createAction(
  `${p} Save ProjectLocations`
);

export const saveProjectLocationsSuccess = createAction(
  `${p} Save ProjectLocations Success`,
  props<{ data: any }>()
);

export const saveProjectLocationsFailure = createAction(
  `${p} Save ProjectLocations Failure`,
  props<{ error: any }>()
);
