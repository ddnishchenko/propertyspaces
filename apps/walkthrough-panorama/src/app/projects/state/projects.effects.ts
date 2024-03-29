import { Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import * as ProjectsActions from './projects.actions';
import { ProjectsService } from '../service/projects.service';
import { Panorama } from '../../interfaces/panorama';
import { SnotifyService } from 'ng-snotify';


@Injectable()
export class ProjectsEffects {

  a;

  constructor(
    private actions$: Actions,
    private projectsService: ProjectsService,
    private snotifyService: SnotifyService,
    private ngZone: NgZone
  ) {
    this.a = document.createElement('a');
    this.a.target = '_blank';
  }


  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadProjects),
    mergeMap(
      () => this.projectsService.list().pipe(
        map(projects => ProjectsActions.loadProjectsSuccess({ projects }))
      )
    )
  )
  );

  loadProjectsByUser$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadProjectsByUser),
    mergeMap(
      ({ userId }) => this.projectsService.list(userId).pipe(
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
      (payload) => this.projectsService.create(payload.project).pipe(
        map((project) => {
          this.snotifyService.success('Project has been created');
          return ProjectsActions.createProjectSuccess({ project });
        })
      )
    )
  )
  );

  updateProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.updateProject),
    mergeMap(
      payload => this.projectsService.update(payload.projectId, payload.project).pipe(
        map(project => {
          this.snotifyService.success('Project has been updated.');
          return ProjectsActions.updateProjectSuccess({ project });
        })
      )
    )
  )
  );

  deleteProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.deleteProjects),
    mergeMap(
      payload => forkJoin(payload.projectIds.map(id => this.projectsService.delete(id))).pipe(
        map(() => {
          this.snotifyService.warning('Project has been deleted.');
          return ProjectsActions.deleteProjectsSuccess({ projectIds: payload.projectIds });
        })
      )
    )
  )
  );

  addPanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createPanorama),
    mergeMap(
      payload => this.projectsService.addPanorama(payload.projectId, payload.panorama).pipe(
        map(panoramas => {
          this.snotifyService.success('Panorama has been created.');
          return ProjectsActions.createPanoramaSuccess({ panoramas });
        })
      )
    )
  )
  );

  updatePanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.updatePanorama),
    mergeMap(
      payload => {
        const exclude = ['index', 'loaded', 'object', 'transitionFrom', 'updatedAt'];
        const panorama: Panorama = {};
        Object
          .keys(payload.panorama)
          .filter(k => !exclude.includes(k))
          .forEach(k => panorama[k] = payload.panorama[k]);
        return this.projectsService.updatePanorama(payload.projectId, panorama).pipe(
          map(panoramas => {
            this.snotifyService.success('Panorama has been updated.');
            return ProjectsActions.updatePanoramaSuccess({ panoramas });
          })
        );
      }
    )
  )
  );

  deletePanorama$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.deletePanorama),
    mergeMap(
      payload => forkJoin(payload.panoramas.map(name => this.projectsService.deletePanorama(payload.projectId, name))).pipe(
        map(res => {
          this.snotifyService.success('Project has been deleted.');
          return ProjectsActions.deletePanoramaSuccess(payload);
        })
      )
    )
  )
  );

  // -----
  addGalleryItem$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.addGalleryItem),
    mergeMap(
      payload => this.projectsService.addGalleryItem(payload.projectId, payload.photo).pipe(
        map(photos => {
          this.snotifyService.success('Photo has been added to the project gallery.');
          return ProjectsActions.addGalleryItemSuccess({ photos });
        })
      )
    )
  )
  );

  updateGalleryItem$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.updateGalleryItem),
    mergeMap(
      payload => {
        const exclude = ['index', 'loaded', 'object', 'transitionFrom', 'updatedAt'];
        const photo: any = {};
        Object
          .keys(payload.photo)
          .filter(k => !exclude.includes(k))
          .forEach(k => photo[k] = payload.photo[k]);
        return this.projectsService.updateGalleryItem(payload.projectId, photo).pipe(
          map(photos => {
            this.snotifyService.success('Photo has been updated.');
            return ProjectsActions.updateGalleryItemSuccess({ photos });
          })
        );
      }
    )
  )
  );

  deleteGalleryItem$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.deleteGalleryItem),
    mergeMap(
      payload => forkJoin(payload.photos.map(name => this.projectsService.deleteGalleryItem(payload.projectId, name))).pipe(
        map(res => {
          this.snotifyService.success('Photo has been deleted from the project gallery.');
          return ProjectsActions.deleteGalleryItemSuccess(payload);
        })
      )
    )
  )
  );

  buildProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.buildProject),
    mergeMap(
      payload => this.projectsService.buildProject(payload.projectId).pipe(
        map(build => {
          this.snotifyService.success('Project has been built and ready for download.');
          this.ngZone.runOutsideAngular(() => {
            this.a.href = build.build.url;
            this.a.click();
          });
          return ProjectsActions.buildProjectSuccess(build);
        })
      )
    )
  )
  );

  buildProjectGallery$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.buildProjectGallery),
    mergeMap(
      payload => this.projectsService.buildProjectGallery(payload.projectId).pipe(
        map(build => {
          this.snotifyService.success('Project gallery has been built and ready for download.');
          this.ngZone.runOutsideAngular(() => {
            this.a.href = build.buildGallery.url;
            this.a.click();
            // window.open(build.buildGallery.url, '_blank');
          });
          return ProjectsActions.buildProjectGallerySuccess(build);
        })
      )
    )
  )
  );

  activateProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.activateProject),
    mergeMap(
      payload => this.projectsService.activate(payload.projectId).pipe(
        map(project => {
          this.snotifyService.success('Project has been activated.');
          return ProjectsActions.activateProjectSuccess({ project: { ...project, id: payload.projectId } });
        })
      )
    )
  )
  );


  deactivateProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.deactivateProject),
    mergeMap(
      payload => this.projectsService.deactivate(payload.projectId).pipe(
        map(project => {
          this.snotifyService.success('Project has been deactivated.');
          return ProjectsActions.deactivateProjectSuccess({ project: { ...project, id: payload.projectId } });
        })
      )
    )
  )
  );
}
