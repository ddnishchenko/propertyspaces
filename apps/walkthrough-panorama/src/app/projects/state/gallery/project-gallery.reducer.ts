import { Action, createReducer, on } from '@ngrx/store';
import { ImageGallery } from '../../../interfaces/image-gallery';
import * as ProjectGalleryActions from './project-gallery.actions';

export const projectGalleryFeatureKey = 'projectGallery';

export interface State {
  gallery: ImageGallery[];
  order: string;
  headerPicture: string;
}

export const initialState: State = {
  gallery: [],
  order: '',
  headerPicture: ''
};


export const reducer = createReducer(
  initialState,

  on(ProjectGalleryActions.loadProjectGallerySuccess, (state, { gallery, order }) => ({
    ...state,
    gallery,
    order
  })),
  on(ProjectGalleryActions.uploadProjectGalleryPhotoSuccess, (state, {photo, order}) => ({
    ...state,
    gallery: state.gallery.concat(photo),
    order
  })),
  on(ProjectGalleryActions.removeProjectGalleryPhotoSuccess, (state, {image_id}) => {
    return {
      ...state,
      gallery: state.gallery.filter(p => !image_id.includes(p.name)),
      order: state.order.split(',').filter(p => !image_id.includes(p)).join(','),
    };
  }),
  on(ProjectGalleryActions.changeOrderOfPhotoSuccess, (state, {order}) => ({
    ...state,
    order
  })),
  on(ProjectGalleryActions.renamePhotoSuccess, (state, {oldName, newName, order}) => ({
    ...state,
    gallery: state.gallery.map(item => item.name === oldName ? {...item, name: newName} : item),
    order
  })),
  on(ProjectGalleryActions.setHeaderPictureSuccess, (state, {pictureName}) => ({...state, pictureName}) )
);

