import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, map, mergeMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';

import * as ProjectGalleryActions from './project-gallery.actions';
import { ProjectsService } from '../../service/projects.service';


@Injectable()
export class ProjectGalleryEffects {


  loadProjectGallerys$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(ProjectGalleryActions.loadProjectGallery),
      mergeMap(
        payload => this.projectService.loadGallery(payload.projetId).pipe(
          map(gallery => ProjectGalleryActions.loadProjectGallerySuccess({gallery}))
        )
      )
    );
  });

  uploadProjectGalleryPhoto$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectGalleryActions.uploadProjectGalleryPhoto),
      mergeMap(
        payload => this.projectService.uploadGalleryPhoto(payload.form).pipe(
          map(photo => ProjectGalleryActions.uploadProjectGalleryPhotoSuccess({photo}))
        )
      )
    )
  );

  removeProjectGalleryPhoto$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectGalleryActions.removeProjectGalleryPhoto),
      mergeMap(
        payload => this.projectService.removeGalleryImage(payload.projectId, payload.name).pipe(
          map(() => ProjectGalleryActions.removeProjectGalleryPhotoSuccess(payload))
        )
      )
    )
  )


  constructor(
    private actions$: Actions,
    private projectService: ProjectsService
  ) {}

}
