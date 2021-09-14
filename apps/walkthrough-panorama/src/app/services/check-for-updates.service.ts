import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { SnotifyService } from 'ng-snotify';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdatesService {

  constructor(
    appRef: ApplicationRef,
    updates: SwUpdate,
    snotifyService: SnotifyService,
  ) {
    console.log('Update watcher initialized:', new Date());
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());

    updates.available.subscribe(event => {
      const conf = confirm('There is a new version of the website arrived. Do you want to perform an update?');
      if (conf) {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });

    updates.unrecoverable.subscribe(event => {
      snotifyService.info(`An error occurred that we cannot recover from:\n${event.reason}\n\n` +
        'Please reload the page.');
    });

  }
}
