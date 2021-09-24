import { createAction, props } from '@ngrx/store';
import { Panorama } from '../../interfaces/panorama';
import { Project } from '../../interfaces/project';

const prefix = '[Projects]';
export const loadProjects = createAction(
  `${prefix} Load Projects`
);

export const loadProjectsByUser = createAction(
  `${prefix} Load Projects by user`,
  props<{ userId: string }>()
);

export const loadProjectsSuccess = createAction(
  `${prefix} Load Projects Success`,
  props<{ projects: Project[] }>()
);

export const loadProjectsFailed = createAction(
  `${prefix} Load Projects Failed`
);

export const loadProject = createAction(
  `${prefix} Load Project`,
  props<{ projectId: string }>()
);

export const loadProjectSuccess = createAction(
  `${prefix} Load Project Success`,
  props<{ project: Project }>()
);

export const loadProjectFailed = createAction(
  `${prefix} Load Project Failed`,
);

export const createProject = createAction(
  `${prefix} Create Project`,
  props<{ project: Project }>()
);

export const createProjectSuccess = createAction(
  `${prefix} Create Project Success`,
  props<{ project: Project }>()
);

export const createProjectFailed = createAction(
  `${prefix} Create Project Failed`
);

export const deleteProjects = createAction(
  `${prefix} Delete Projects`,
  props<{ projectIds: string[] }>()
);

export const deleteProjectsSuccess = createAction(
  `${prefix} Delete Projects Success`,
  props<{ projectIds: string[] }>()
);

export const deleteProjectsFailed = createAction(
  `${prefix} Delete Projects Failed`
);

export const editProject = createAction(
  `${prefix} Edit Project`,
  props<{ projectId: string; project: Project }>()
);

export const editProjectSuccess = createAction(
  `${prefix} Edit Project Success`,
  props<{ projectId: string; project: Project }>()
);

export const editProjectFailed = createAction(
  `${prefix} Edit Project Failed`
);

export const updateProject = createAction(
  `${prefix} Update Project`,
  props<{ projectId: string, project: Project }>()
);

export const updateProjectSuccess = createAction(
  `${prefix} Update Project Success`,
  props<{ project: Project }>()
);

export const updateProjectFailed = createAction(
  `${prefix} Update Project Failed`
);

export const createPanorama = createAction(
  `${prefix} Create Panorama`,
  props<{ panorama: Panorama; projectId: string; }>()
);

export const createPanoramaSuccess = createAction(
  `${prefix} Create Panorama success`,
  props<{ panoramas: Panorama[]; }>()
);

export const createPanoramaFailed = createAction(
  `${prefix} Create Panorama failed`
);

export const updatePanorama = createAction(
  `${prefix} Update Panorama`,
  props<{ panorama: Panorama; projectId: string; }>()
);

export const updatePanoramaSuccess = createAction(
  `${prefix} Update Panorama success`,
  props<{ panoramas: Panorama[]; }>()
);

export const updatePanoramaFailed = createAction(
  `${prefix} Update Panorama failed`
);

export const deletePanorama = createAction(
  `${prefix} Delete Panorama`,
  props<{ projectId: string; panoramas: Panorama[] }>()
);

export const deletePanoramaSuccess = createAction(
  `${prefix} Delete Panorama success`,
  props<{ projectId: string; panoramas: Panorama[] }>()
);

export const deletePanoramaFailed = createAction(
  `${prefix} Delete Panorama failed`
);

export const createHdrPanorama = createAction(
  `${prefix} Create HDR Panorama`,
  props<{ name: string; projectId: string; }>()
);

export const createHdrPanoramaSuccess = createAction(
  `${prefix} Create HDR Panorama success`,
  props<{ panorama: Panorama; }>()
);

export const createHdrPanoramaFailed = createAction(
  `${prefix} Create HDR Panorama failed`,
  props<{ error: string }>()
);

export const patchPanoForm = createAction(
  `${prefix} Patch Pano form`,
  props<Panorama>()
);

export const panoFormMode = createAction(
  `${prefix} Pano form mode`,
  props<{ isEdit: boolean }>()
);

export const updateAddressData = createAction(
  `${prefix} Update Address`,
  props<{ projectId: string; data: any }>()
);

export const updateContacts = createAction(
  `${prefix} Update Contacts`,
  props<{ projectId: string; data: any }>()
);

export const addGalleryItem = createAction(
  `${prefix} Add Gallery Item`,
  props<{ projectId: string; photo: any }>()
);

export const addGalleryItemSuccess = createAction(
  `${prefix} Add Gallery Item Success`,
  props<{ photos: any[] }>()
);

export const addGalleryItemFailute = createAction(
  `${prefix} Add Gallery Item Failure`
);

export const updateGalleryItem = createAction(
  `${prefix} Update Gallery Item`,
  props<{ projectId: string; photo: any }>()
);

export const updateGalleryItemSuccess = createAction(
  `${prefix} Update Gallery Item Success`,
  props<{ photos: any[] }>()
);

export const updateGalleryItemFailute = createAction(
  `${prefix} Update Gallery Item Failure`
);


export const deleteGalleryItem = createAction(
  `${prefix} Delete Gallery Item`,
  props<{ projectId: string; photos: any[] }>()
);

export const deleteGalleryItemSuccess = createAction(
  `${prefix} Delete Gallery Item Success`,
  props<{ photos: any[] }>()
);

export const deleteGalleryItemFailute = createAction(
  `${prefix} Delete Gallery Item Failure`
);


export const buildProject = createAction(
  `${prefix} Build project`,
  props<{ projectId: string; }>()
);

export const buildProjectSuccess = createAction(
  `${prefix} Build project Success`,
  props<{ build: { url: string; builtAt: number }; }>()
);
