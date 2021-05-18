import { Action, createReducer, on } from '@ngrx/store';
import { Project } from '../../interfaces/project';
import { ProjectSite } from '../../interfaces/project-site';
import * as ProjectsActions from './projects.actions';

export const projectsFeatureKey = 'projects';

export interface ProjectsState {
  projects: ProjectSite[];
  activeProjectId: string;
  virtualTourParameters: Project;
}

export const initialState: ProjectsState = {
  projects: [],
  activeProjectId: null,
  virtualTourParameters: null
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
  }),
  on(ProjectsActions.editProjectSuccess, (state, {projectId, name}) => {
    return {
      ...state,
      projects: state.projects.map(p => {
        if (p.id === projectId) {
          return {...p, name};
        }
        return p;
      })
    };
  }),
  on(ProjectsActions.setActiveProject, (state, {projectId}) => ({...state, activeProjectId: projectId})),
  on(
    ProjectsActions.loadPanoramasSuccess,
    ProjectsActions.createPanoramaSuccess,
    ProjectsActions.updatePanoramaSuccess,
    ProjectsActions.createHdrPanoramaSuccess,
    (state, { project }) => {
      return {
        ...state,
        virtualTourParameters: project
      }
    }
  ),
  on(ProjectsActions.deletePanoramaSuccess, (state, {projectId, names}) => {
    return {
      ...state,
      virtualTourParameters: {
        ...state.virtualTourParameters,
        data: state.virtualTourParameters.data.filter(p => names.includes(p.name))
      }
    }
  })
);

