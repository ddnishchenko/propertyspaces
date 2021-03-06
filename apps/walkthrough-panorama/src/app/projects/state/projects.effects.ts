import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, map, mergeMap, tap } from 'rxjs/operators';
import { Observable, EMPTY, forkJoin } from 'rxjs';

import * as ProjectsActions from './projects.actions';
import { ProjectsService } from '../service/projects.service';
import { Store } from '@ngrx/store';


@Injectable()
export class ProjectsEffects {


  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadProjects),
    mergeMap(
      () => this.projectsService.getProjects().pipe(
        map(projects => ProjectsActions.loadProjectsSuccess({ projects }))
      )
    )
  )
  );

  createProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createProject),
    mergeMap(
      (payload) => this.projectsService.createProject(payload).pipe(
        map((project) => ProjectsActions.createProjectSuccess({
          project: { ...project, ...payload }
        }))
      )
    )
  )
  );

  deleteProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.deleteProjects),
    mergeMap(
      payload => forkJoin(payload.projectIds.map(id => this.projectsService.deleteProject(id))).pipe(
        map(() => ProjectsActions.deleteProjectsSuccess({ projectIds: payload.projectIds }))
      )
    )
  )
  );

  copyProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.copyProject),
    mergeMap(
      payload => this.projectsService.copyProject(payload.projectId).pipe(
        map((project) => ProjectsActions.copyProjectSuccess({ oldProjectId: payload.projectId, newProjectId: project.project_id }))
      )
    )
  )
  );

  editProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.editProject),
    mergeMap(
      payload => this.projectsService.editProjectName(payload.projectId, payload.name).pipe(
        map(project => ProjectsActions.editProjectSuccess(payload))
      )
    )
  )
  );

  updateProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.updateProject),
    mergeMap(
        payload => this.projectsService.updateDataProject(payload.projectId, payload.data).pipe(
          map(project => ProjectsActions.updateProjectSuccess({ project: payload.data }))
        )
      )
    )
  );

  updateContacts$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.updateContacts),
    mergeMap(
        payload => this.projectsService.updateContact(payload.projectId, payload.data).pipe(
          map(project => ProjectsActions.loadPanoramasSuccess({ project }))
        )
      )
    )
  )

  loadPanoramas$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadPanoramas),
    mergeMap(
      payload => this.projectsService.getPanoramas(payload.projectId).pipe(
        map(project => ProjectsActions.loadPanoramasSuccess({ project }))
      )
    )
  )
  );

  createPanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createPanorama),
    mergeMap(
      payload => this.projectsService.createPanorama(payload.projectId, payload.panorama).pipe(
        map(project => ProjectsActions.createPanoramaSuccess({ project }))
      )
    )
  )
  );

  updatePanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.updatePanorama),
    mergeMap(
      payload => this.projectsService.updatePanorama(payload.projectId, payload.panorama).pipe(
        map(project => ProjectsActions.updatePanoramaSuccess({ project }))
      )
    )
  )
  );

  deletePanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.deletePanorama),
    mergeMap(
      payload => forkJoin(payload.names.map(name => this.projectsService.deletePanoramaProject(payload.projectId, name))).pipe(
        map(res => ProjectsActions.deletePanoramaSuccess(payload))
      )
    )
  )
  );

  createHdrPanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createHdrPanorama),
    mergeMap(
      payload => this.projectsService.makeHdr(payload.projectId, payload.name).pipe(
        map(project => {
          if (project.hasOwnProperty('error')) {
            return ProjectsActions.createHdrPanoramaFailed({ error: project.error });
          }
          return ProjectsActions.createHdrPanoramaSuccess({ project });
        })
      )
    )
  )
  );

  updateAddressData = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.updateAddressData),
    mergeMap(
      payload => this.projectsService.updateAddress(payload.projectId, payload.data).pipe(
        tap(() => this.store.dispatch(ProjectsActions.loadPanoramas({ projectId: payload.projectId })))
      )
    )
  ), { dispatch: false });


  constructor(
    private actions$: Actions,
    private projectsService: ProjectsService,
    private store: Store
  ) { }

}
