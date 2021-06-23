import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import * as ProjectGalleryActions from './project-gallery.actions';
import { ProjectsService } from '../../service/projects.service';


function parseNames(data: string): string[] {
  if (data) {
    return data.split(',')
  }
  return [];
}

function stringifyNames(data: string[]): string {
  return data ? data.join(',') : '';
}

@Injectable()
export class ProjectGalleryEffects {

  loadProjectGallerys$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(ProjectGalleryActions.loadProjectGallery),
      mergeMap(
        payload => forkJoin([this.projectService.loadGallery(payload.projectId), this.projectService.getPanoramas(payload.projectId)]).pipe(
          map(([gallery, project]) => {
            const galleryOrderString = project.additional_data?.galleryOrder || '';
            return ProjectGalleryActions.loadProjectGallerySuccess({
              gallery,
              order: galleryOrderString
            })
          })
        )
      )
    );
  });
  // ProjectGalleryActions.uploadProjectGalleryPhotoSuccess({photo})
  /**
   * 1. Upload Photo
   * 2. Put uploaded photo to sorting array in last position
   * 3. Save order of the photos
   */
  uploadProjectGalleryPhoto$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectGalleryActions.uploadProjectGalleryPhoto),
      mergeMap(
        payload => this.projectService.uploadGalleryPhoto(payload.projectId, payload.file).pipe(
          mergeMap(
            photo => this.projectService.getPanoramas(payload.projectId).pipe(
              mergeMap(
                project => {
                  const ids = parseNames(project.additional_data?.galleryOrder);
                  const items = ids.concat(photo.name);
                  const galleryOrderString = stringifyNames(items);
                  return this.projectService.updateDataProject(payload.projectId, {
                    galleryOrder: galleryOrderString
                  }).pipe(
                    map(updatedProject =>
                      ProjectGalleryActions.uploadProjectGalleryPhotoSuccess({photo, order: galleryOrderString})
                    )
                  )
                }
              )
            )
          )
        )
      )
    )
  );
  // ProjectGalleryActions.removeProjectGalleryPhotoSuccess(payload)
  removeProjectGalleryPhoto$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectGalleryActions.removeProjectGalleryPhoto),
      mergeMap(
        payload => this.projectService.removeGalleryImage(payload.projectId, payload.image_id).pipe(
          mergeMap(
            () => this.projectService.getPanoramas(payload.projectId).pipe(
              mergeMap(
                project => {
                  const ids = parseNames(project.additional_data?.galleryOrder);
                  const items = ids.filter(p => !payload.image_id.includes(p));
                  const galleryOrderString = stringifyNames(items);
                  return this.projectService.updateDataProject(payload.projectId, {
                    galleryOrder: galleryOrderString
                  }).pipe(
                    map(() => ProjectGalleryActions.removeProjectGalleryPhotoSuccess(payload))
                  );
                }
              )
            )
          )
        )
      )
    )
  );

  /**
   * Change sort
   * 1. Save order of the photos
   *
   */

  changeOrderPhoto$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectGalleryActions.changeOrderOfPhoto),
      mergeMap(
        payload => {
          const g = stringifyNames(payload.photos);
          return this.projectService.updateDataProject(payload.projectId, {galleryOrder: g}).pipe(
            map(() => ProjectGalleryActions.changeOrderOfPhotoSuccess({order: g}))
          )
        }
      )
    )
  );

  renamePhoto$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectGalleryActions.renamePhoto),
      mergeMap(
        payload => this.projectService.changeGalleryImageName(payload.projectId, payload.oldName, payload.newName).pipe(
          mergeMap(
            (res) => this.projectService.getPanoramas(payload.projectId).pipe(
              mergeMap(
                project => {
                  if (!res.error) {

                  }
                  const ids = parseNames(project.additional_data?.galleryOrder);
                  const items = ids.map(p => p === payload.oldName ? payload.newName : p);
                  const galleryOrderString = stringifyNames(items);
                  return this.projectService.updateDataProject(payload.projectId, {
                    galleryOrder: galleryOrderString
                  }).pipe(
                    map(() => ProjectGalleryActions.renamePhotoSuccess({order: galleryOrderString, ...payload}))
                  );
                }
              )
            )
          )
        )
      )
    )
  );

  setHeaderPicture = createEffect(() => this.actions$.pipe(
      ofType(ProjectGalleryActions.setHeaderPicture),
      mergeMap(
        payload => this.projectService.updateDataProject(payload.projectId, {headerPicture: payload.pictureName}).pipe(
          map(() => ProjectGalleryActions.setHeaderPictureSuccess(payload))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private projectService: ProjectsService
  ) {}

}
