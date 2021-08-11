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
  on(ProjectsActions.editProjectSuccess, (state, { project }) => ({ ...state, project })),
  on(ProjectsActions.createPanoramaSuccess, (state, { panorama }) => ({
    ...state,
    project: {
      ...state.project,
      panoramas: state.project.panoramas ? state.project.panoramas.concat(panorama) : [panorama]
    }
  })),
  on(ProjectsActions.updatePanoramaSuccess, (state, { panorama }) => ({
    ...state,
    project: {
      ...state.project,
      panoramas: state.project.panoramas.map(p => p.name === panorama.name ? panorama : p)
    }

  })),
);

