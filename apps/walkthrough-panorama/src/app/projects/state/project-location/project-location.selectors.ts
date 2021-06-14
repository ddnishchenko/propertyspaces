import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProjectLocation from './project-location.reducer';

export const selectProjectLocationState = createFeatureSelector<fromProjectLocation.State>(
  fromProjectLocation.projectLocationFeatureKey
);
