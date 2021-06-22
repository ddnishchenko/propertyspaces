import { createAction, props } from '@ngrx/store';
import { ImageGallery } from '../../../interfaces/image-gallery';

const p = '[ProjectGallery]';

export const loadProjectGallery = createAction(
  `${p} Load ProjectGallery`,
  props<{projectId: string}>()
);

export const loadProjectGallerySuccess = createAction(
  `${p} Load ProjectGallery Success`,
  props<{gallery: ImageGallery[], order: string}>()
);

export const loadProjectGalleryFail = createAction(
  `${p} Load ProjectGallery Fail`
);

export const uploadProjectGalleryPhoto = createAction(
  `${p} Upload ProjectGallery Photo`,
  props<{projectId: string; file: File;}>()
);

export const uploadProjectGalleryPhotoSuccess = createAction(
  `${p} Upload ProjectGallery Photo Success`,
  props<{photo: ImageGallery, order: string}>()
);

export const uploadProjectGalleryPhotoFail = createAction(
  `${p} Upload ProjectGallery Photo Fail`,
);

export const removeProjectGalleryPhoto = createAction(
  `${p} Remove ProjectGallery Photo`,
  props<{projectId: string; image_id: string[];}>()
);

export const removeProjectGalleryPhotoSuccess = createAction(
  `${p} Remove ProjectGallery Photo Success`,
  props<{projectId: string; image_id: string[];}>()
);


export const removeProjectGalleryPhotoFail = createAction(
  `${p} Remove ProjectGallery Photo Fail`
);

export const changeOrderOfPhoto = createAction(
  `${p} Change Order of Photo`,
  props<{projectId: string; photos: string[]}>()
);

export const changeOrderOfPhotoSuccess = createAction(
  `${p} Change Order of Photo Success`,
  props<{order: string}>()
);

export const renamePhoto = createAction(
  `${p} Rename Photo`,
  props<{projectId: string; oldName: string; newName: string}>()
);

export const renamePhotoSuccess = createAction(
  `${p} Rename Photo Success`,
  props<{projectId: string; oldName: string; newName: string, order: string}>()
);

export const setHeaderPicture = createAction(
  `${p} Set Header picture`,
  props<{projectId: string; pictureName: string;}>()
);

export const setHeaderPictureSuccess = createAction(
  `${p} Set Header picture`,
  props<{projectId: string; pictureName: string;}>()
);
