import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private snotifyService: SnotifyService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(err => {
        this.snotifyService.error(err.message);
        return throwError(() => err);
      })
    );
  }
}
