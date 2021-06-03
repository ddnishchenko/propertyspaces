import { createAction, props } from '@ngrx/store';
import { Panorama } from '../../interfaces/panorama';
import { Project } from '../../interfaces/project';
import { ProjectSite } from '../../interfaces/project-site';

const prefix = '[Projects]';
export const loadProjects = createAction(
  `${prefix} Load Projects`
);

export const loadProjectsSuccess = createAction(
  `${prefix} Load Projects Success`,
  props<{projects: ProjectSite[]}>()
);

export const loadProjectsFailed = createAction(
  `${prefix} Load Projects Failed`
);

export const createProject = createAction(
  `${prefix} Create Project`,
  props<{name: string, address: string}>()
);

export const createProjectSuccess = createAction(
  `${prefix} Create Project Success`,
  props<{project: Project}>()
);

export const createProjectFailed = createAction(
  `${prefix} Create Project Failed`
);

export const deleteProjects = createAction(
  `${prefix} Delete Projects`,
  props<{projectIds: string[]}>()
);

export const deleteProjectsSuccess = createAction(
  `${prefix} Delete Projects Success`,
  props<{projectIds: string[]}>()
);

export const deleteProjectsFailed = createAction(
  `${prefix} Delete Projects Failed`
);

export const copyProject = createAction(
  `${prefix} Copy Project`,
  props<{projectId: string}>()
);

export const copyProjectSuccess = createAction(
  `${prefix} Copy Project Success`,
  props<{oldProjectId: string, newProjectId: string}>()
);

export const copyProjectFailed = createAction(
  `${prefix} Copy Project Failed`
);

export const editProject = createAction(
  `${prefix} Edit Project`,
  props<{projectId: string; name: string}>()
);

export const editProjectSuccess = createAction(
  `${prefix} Edit Project Success`,
  props<{projectId: string; name: string}>()
);

export const editProjectFailed = createAction(
  `${prefix} Edit Project Failed`
);

export const updateProject = createAction(
  `${prefix} Update Project`,
  props<{projectId: string, data: any}>()
);

export const updateProjectSuccess = createAction(
  `${prefix} Update Project Success`,
  props<{project: Project}>()
);

export const updateProjectFailed = createAction(
  `${prefix} Update Project Failed`
);

export const setActiveProject = createAction(
  `${prefix} Set active Project`,
  props<{projectId: string;}>()
);


export const loadPanoramas = createAction(
  `${prefix} Load Panoramas`,
  props<{projectId: string}>()
);

export const loadPanoramasSuccess = createAction(
  `${prefix} Load Panoramas success`,
  props<{project: Project}>()
);

export const loadPanoramasFailed = createAction(
  `${prefix} Load Panoramas failed`
);

export const createPanorama = createAction(
  `${prefix} Create Panorama`,
  props<{panorama: Panorama; projectId: string;}>()
);

export const createPanoramaSuccess = createAction(
  `${prefix} Create Panorama success`,
  props<{project: Project;}>()
);

export const createPanoramaFailed = createAction(
  `${prefix} Create Panorama failed`
);

export const updatePanorama = createAction(
  `${prefix} Update Panorama`,
  props<{panorama: Panorama; projectId: string;}>()
);

export const updatePanoramaSuccess = createAction(
  `${prefix} Update Panorama success`,
  props<{project: Project;}>()
);

export const updatePanoramaFailed = createAction(
  `${prefix} Update Panorama failed`
);

export const deletePanorama = createAction(
  `${prefix} Delete Panorama`,
  props<{names: string[]; projectId: string;}>()
);

export const deletePanoramaSuccess = createAction(
  `${prefix} Delete Panorama success`,
  props<{names: string[]; projectId: string;}>()
);

export const deletePanoramaFailed = createAction(
  `${prefix} Delete Panorama failed`
);

export const createHdrPanorama = createAction(
  `${prefix} Create HDR Panorama`,
  props<{name: string; projectId: string;}>()
);

export const createHdrPanoramaSuccess = createAction(
  `${prefix} Create HDR Panorama success`,
  props<{project: Project;}>()
);

export const createHdrPanoramaFailed = createAction(
  `${prefix} Create HDR Panorama failed`,
  props<{error: string}>()
);

export const patchPanoForm = createAction(
  `${prefix} Patch Pano form`,
  props<Panorama>()
);

export const panoFormMode = createAction(
  `${prefix} Pano form mode`,
  props<{isEdit: boolean}>()
);
