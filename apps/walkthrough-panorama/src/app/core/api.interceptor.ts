import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { logout } from './state/core.actions';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private snotifyService: SnotifyService,
    private authService: AuthService,
    private store: Store
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let req = request;
    if (request.url.includes(environment.apiHost)) {
      req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.accessToken}`
        }
      })
    }
    return next.handle(req).pipe(
      catchError(e => {
        this.snotifyService.error(e.error.message);
        if (e.error.message === 'jwt expired') {
          this.store.dispatch(logout());
        }
        return throwError(() => e);
      })
    );
  }
}
