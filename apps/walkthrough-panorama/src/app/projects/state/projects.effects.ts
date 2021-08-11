import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import * as ProjectsActions from './projects.actions';
import { ProjectsService } from '../service/projects.service';


@Injectable()
export class ProjectsEffects {


  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadProjects),
    mergeMap(
      () => this.projectsService.list().pipe(
        map(projects => ProjectsActions.loadProjectsSuccess({ projects }))
      )
    )
  )
  );

  loadProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadProject),
    mergeMap(
      payload => this.projectsService.read(payload.projectId).pipe(
        map(project => ProjectsActions.loadProjectSuccess({ project }))
      )
    )
  )
  );

  createProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createProject),
    mergeMap(
      (payload) => this.projectsService.create(payload.project).pipe(map((project) => ProjectsActions.createProjectSuccess({ project })))
    )
  )
  );

  updateProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.updateProject),
    mergeMap(
      payload => this.projectsService.update(payload.projectId, payload.project).pipe(
        map(project => ProjectsActions.updateProjectSuccess({ project: payload.project }))
      )
    )
  )
  );

  deleteProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.deleteProjects),
    mergeMap(
      payload => forkJoin(payload.projectIds.map(id => this.projectsService.delete(id))).pipe(
        map(() => ProjectsActions.deleteProjectsSuccess({ projectIds: payload.projectIds }))
      )
    )
  )
  );

  copyProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.copyProject),
    mergeMap(
      payload => this.projectsService.copyProject(payload.projectId).pipe(
        map((project) => ProjectsActions.copyProjectSuccess({ oldProjectId: payload.projectId, newProjectId: project.id }))
      )
    )
  )
  );

  addPanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createPanorama),
    mergeMap(
      payload => this.projectsService.addPanorama(payload.projectId, payload.panorama).pipe(
        map(panoramas => ProjectsActions.createPanoramaSuccess({ panoramas }))
      )
    )
  )
  );

  updatePanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.updatePanorama),
    mergeMap(
      payload => this.projectsService.updatePanorama(payload.projectId, payload.panorama).pipe(
        map(project => ProjectsActions.updatePanoramaSuccess({ panorama: payload.panorama }))
      )
    )
  )
  );

  deletePanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.deletePanorama),
    mergeMap(
      payload => forkJoin(payload.names.map(name => this.projectsService.deletePanorama(payload.projectId, name))).pipe(
        map(res => ProjectsActions.deletePanoramaSuccess(payload))
      )
    )
  )
  );


  constructor(
    private actions$: Actions,
    private projectsService: ProjectsService,
  ) { }

}
