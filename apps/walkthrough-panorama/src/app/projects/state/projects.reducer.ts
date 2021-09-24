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
      panoramas: [
        ...state.project.panoramas,
        ...panoramas
      ]
    }
  })),
  on(ProjectsActions.updatePanoramaSuccess, (state, { panoramas }) => ({
    ...state,
    project: {
      ...state.project,
      panoramas: state.project.panoramas.map(p => p.id === panoramas[0].id ? panoramas[0] : p)
    }

  })),
  on(ProjectsActions.deletePanoramaSuccess, (state, { panoramas }) => {
    const panoIds = panoramas.map(p => p.id);
    return {
      ...state,
      project: {
        ...state.project,
        panoramas: state.project.panoramas.filter(p => !panoIds.includes(p.id))
      }
    };
  }),
  //
  on(ProjectsActions.addGalleryItemSuccess, (state, { photos }) => ({
    ...state,
    project: {
      ...state.project,
      gallery: [
        ...state.project.gallery,
        ...photos
      ]
    }
  })),
  on(ProjectsActions.updateGalleryItemSuccess, (state, { photos }) => ({
    ...state,
    project: {
      ...state.project,
      gallery: state.project.gallery.map(p => p.id === photos[0].id ? photos[0] : p)
    }

  })),
  on(ProjectsActions.deleteGalleryItemSuccess, (state, { photos }) => {
    const photoIds = photos.map(p => p.id);
    return {
      ...state,
      project: {
        ...state.project,
        gallery: state.project.gallery.filter(p => !photoIds.includes(p.id))
      }
    };
  }),
  on(ProjectsActions.buildProjectSuccess, (state, { build }) => {
    return {
      ...state,
      project: {
        ...state.project,
        build
      }
    };
  })
);

