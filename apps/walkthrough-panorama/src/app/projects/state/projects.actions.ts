import { createAction, props } from '@ngrx/store';
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
  `${prefix} Copu Project`,
  props<{projectId: string}>()
);

export const copyProjectSuccess = createAction(
  `${prefix} Copu Project Success`,
  props<{oldProjectId: string, newProjectId: string}>()
);

export const copyProjectFailed = createAction(
  `${prefix} Copu Project Failed`
);


