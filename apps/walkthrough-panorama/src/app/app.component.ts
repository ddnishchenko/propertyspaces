import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckForUpdatesService } from './services/check-for-updates.service';

@Component({
  selector: 'propertyspaces-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // constructor(private checkForUpdate: CheckForUpdatesService) { }
}
