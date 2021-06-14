import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as ProjectLocationActions from './project-location.actions';



@Injectable()
export class ProjectLocationEffects {

  loadProjectLocations$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(ProjectLocationActions.loadProjectLocations),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => ProjectLocationActions.loadProjectLocationsSuccess({ data })),
          catchError(error => of(ProjectLocationActions.loadProjectLocationsFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}
