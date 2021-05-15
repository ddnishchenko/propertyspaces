import { Action, createReducer, on } from '@ngrx/store';
import { ProjectSite } from '../../interfaces/project-site';
import * as ProjectsActions from './projects.actions';

export const projectsFeatureKey = 'projects';

export interface State {
  projects: ProjectSite[]
}

export const initialState: State = {
  projects: []
};


export const reducer = createReducer(
  initialState,

  on(ProjectsActions.loadProjects, state => state),
  on(ProjectsActions.loadProjectsSuccess, (state, {projects}) => ({...state, projects})),
  on(ProjectsActions.createProjectSuccess, (state, {project}) => {

    return {
      ...state,
      projects: state.projects.concat({
        id: project.project_id,
        client_id: project.client_id,
        name: project.name,
        address: project.address
      })
    };
  }),
  on(ProjectsActions.deleteProjectsSuccess, (state, { projectIds }) => {
    return {
      ...state,
      projects: state.projects.filter(p => !projectIds.includes(p.id))
    }
  }),
  on(ProjectsActions.copyProjectSuccess, (state, { oldProjectId, newProjectId }) => {
    const oldProject = state.projects.find(p => p.id === oldProjectId);
    return {
      ...state,
      projects: state.projects.concat({
        id: newProjectId,
        client_id: oldProject.client_id,
        name: oldProject.name,
        address: oldProject.address
      })
    };
  })
);

