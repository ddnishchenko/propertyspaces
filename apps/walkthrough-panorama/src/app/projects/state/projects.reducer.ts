import { Action, createReducer, on } from '@ngrx/store';
import { Project } from '../../interfaces/project';
import * as ProjectsActions from './projects.actions';

export const projectsFeatureKey = 'projects';

export interface ProjectsState {
  projects: Project[];
  project: Project;
}

export const initialState: ProjectsState = {
  projects: [],
  project: {},
};


export const reducer = createReducer(
  initialState,
  on(ProjectsActions.loadProjectsSuccess, (state, { projects }) => ({ ...state, projects })),
  on(ProjectsActions.createProjectSuccess, (state, { project }) => ({ ...state, projects: state.projects.concat(project) })),
  on(ProjectsActions.loadProjectSuccess, (state, { project }) => ({ ...state, project })),
  on(ProjectsActions.deleteProjectsSuccess, (state, { projectIds }) => ({ ...state, projects: state.projects.filter(p => !projectIds.includes(p.id)) })),
  on(ProjectsActions.updateProjectSuccess, (state, { project }) => ({
    ...state, project: {
      ...state.project,
      ...project
    }
  })),
  on(ProjectsActions.createPanoramaSuccess, (state, { panoramas }) => ({
    ...state,
    project: {
      ...state.project,
      panoramas
    }
  })),
  on(ProjectsActions.updatePanoramaSuccess, (state, { panoramas }) => ({
    ...state,
    project: {
      ...state.project,
      panoramas
    }

  })),
);

