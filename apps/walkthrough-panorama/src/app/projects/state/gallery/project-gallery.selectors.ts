import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProjectGallery from './project-gallery.reducer';

export const selectProjectGalleryState = createFeatureSelector<fromProjectGallery.State>(
  fromProjectGallery.projectGalleryFeatureKey
);

export const selectGallery = createSelector(selectProjectGalleryState, state => state.gallery);
export const selectOrderedGallery = createSelector(
  selectProjectGalleryState,
  state => state.order.split(',').filter(id => id && id !== 'galleryOrder').map(id => state.gallery.find(item => item.name === id))
);
