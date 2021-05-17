import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, map, mergeMap } from 'rxjs/operators';
import { Observable, EMPTY, forkJoin } from 'rxjs';

import * as ProjectsActions from './projects.actions';
import { ProjectsService } from '../service/projects.service';


@Injectable()
export class ProjectsEffects {


  loadProjects$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectsActions.loadProjects),
      mergeMap(
        () => this.projectsService.getProjects().pipe(
          map(projects => ProjectsActions.loadProjectsSuccess({projects}))
        )
      )
    )
  );

  createProject$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectsActions.createProject),
      mergeMap(
        (payload) => this.projectsService.createProject(payload).pipe(
          map((project) => ProjectsActions.createProjectSuccess({
            project: {...project, ...payload}
          }))
        )
      )
    )
  );

  deleteProjects$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectsActions.deleteProjects),
      mergeMap(
        payload => forkJoin(payload.projectIds.map(id => this.projectsService.deleteProject(id))).pipe(
          map(() => ProjectsActions.deleteProjectsSuccess({projectIds: payload.projectIds}))
        )
      )
    )
  );

  copyProject$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectsActions.copyProject),
      mergeMap(
        payload => this.projectsService.copyProject(payload.projectId).pipe(
          map((project)=> ProjectsActions.copyProjectSuccess({oldProjectId: payload.projectId, newProjectId: project.project_id }))
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

  loadPanoramas$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectsActions.loadPanoramas),
      mergeMap(
        payload => this.projectsService.getPanoramas(payload.projectId).pipe(
          map(panoramas => ProjectsActions.loadPanoramasSuccess({panoramas}))
        )
      )
    )
  );


  constructor(
    private actions$: Actions,
    private projectsService: ProjectsService
  ) {}

}
