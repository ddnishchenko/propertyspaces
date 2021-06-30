import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, LazyMapsAPILoaderConfigLiteral } from '@agm/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { ApiInterceptor } from './api.interceptor';
import { reducers, metaReducers } from './state/core.reducer';
import { ProjectsEffects } from '../projects/state/projects.effects';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularSvgIconModule } from 'angular-svg-icon';


const agmConfig: LazyMapsAPILoaderConfigLiteral = {
  apiKey: 'AIzaSyAWkCS6AN5OnyB9BqcrfpOMlO25Fxvmrwc&amp',
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
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
  ]
})
export class CoreModule { }
