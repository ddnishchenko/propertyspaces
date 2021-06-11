import { Action, createReducer, on } from '@ngrx/store';
import { ImageGallery } from '../../../interfaces/image-gallery';
import * as ProjectGalleryActions from './project-gallery.actions';

export const projectGalleryFeatureKey = 'projectGallery';

export interface State {
  gallery: ImageGallery[];
}

export const initialState: State = {
  gallery: []
};


export const reducer = createReducer(
  initialState,

  on(ProjectGalleryActions.loadProjectGallerySuccess, (state, { gallery }) => ({
    ...state,
    gallery
  })),
  on(ProjectGalleryActions.uploadProjectGalleryPhotoSuccess, (state, {photo}) => ({
    ...state,
    gallery: state.gallery.concat(photo)
  })),
  on(ProjectGalleryActions.removeProjectGalleryPhotoSuccess, (state, {image_id}) => ({
    ...state,
    gallery: state.gallery.filter(p => !image_id.includes(p.name))
  }))
);

