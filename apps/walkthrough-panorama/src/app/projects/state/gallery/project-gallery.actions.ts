import { createAction, props } from '@ngrx/store';
import { ImageGallery } from '../../../interfaces/image-gallery';

const p = '[ProjectGallery]';

export const loadProjectGallery = createAction(
  `${p} Load ProjectGallery`,
  props<{projetId: string}>()
);

export const loadProjectGallerySuccess = createAction(
  `${p} Load ProjectGallery Success`,
  props<{gallery: ImageGallery[]}>()
);

export const loadProjectGalleryFail = createAction(
  `${p} Load ProjectGallery Fail`
);

export const uploadProjectGalleryPhoto = createAction(
  `${p} Upload ProjectGallery Photo`,
  props<{form: HTMLFormElement}>()
);

export const uploadProjectGalleryPhotoSuccess = createAction(
  `${p} Upload ProjectGallery Photo Success`,
  props<{photo: ImageGallery}>()
);

export const uploadProjectGalleryPhotoFail = createAction(
  `${p} Upload ProjectGallery Photo Fail`,
);

export const removeProjectGalleryPhoto = createAction(
  `${p} Remove ProjectGallery Photo`,
  props<{projectId: string; name: string;}>()
);

export const removeProjectGalleryPhotoSuccess = createAction(
  `${p} Remove ProjectGallery Photo Success`,
  props<{projectId: string; name: string;}>()
);


export const removeProjectGalleryPhotoFail = createAction(
  `${p} Remove ProjectGallery Photo Fail`,
  props<{projectId: string; name: string;}>()
);
