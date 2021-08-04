import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, LazyMapsAPILoaderConfigLiteral } from '@agm/core';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { SnotifyModule, SnotifyPosition, SnotifyService, ToastDefaults } from 'ng-snotify';
import { AngularSvgIconModule } from 'angular-svg-icon';

/* import AmplifyUIAngularModule  */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';

import { ApiInterceptor } from './api.interceptor';
import { reducers, metaReducers } from './state/core.reducer';
import { ProjectsEffects } from '../projects/state/projects.effects';

import { environment } from '../../environments/environment';

const agmConfig: LazyMapsAPILoaderConfigLiteral = {
  apiKey: environment.googleMapsApiKey,
  libraries: ['places']
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgProgressModule,
    NgProgressHttpModule,
    NgbModule,
    HttpClientModule,
    SnotifyModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([ProjectsEffects]),
    StoreRouterConnectingModule.forRoot(),
    AngularSvgIconModule.forRoot(),
    AgmCoreModule.forRoot(agmConfig),
    /* configure app with AmplifyUIAngularModule */
    AmplifyUIAngularModule,
    BrowserAnimationsModule
  ],
  exports: [
    NgProgressModule,
    NgbModule,
    SnotifyModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    SnotifyService,
    {
      provide: 'SnotifyToastConfig', useValue: {
        ...ToastDefaults,
        toast: {
          ...ToastDefaults.toast,
          position: SnotifyPosition.rightTop
        }
      }
    },
  ]
})
export class CoreModule { }
