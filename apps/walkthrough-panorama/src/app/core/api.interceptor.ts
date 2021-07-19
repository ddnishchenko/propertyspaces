import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private snotifyService: SnotifyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((res: HttpResponse<any>) => {

        if (res.body?.error) {
          this.snotifyService.error(res.body.error);
        } else {
          if (res.url) {
            const url = new URL(res.url);
            if (url.pathname.includes('create')) {
              this.snotifyService.success('Data has been successfully created.');
            }
            if (url.pathname.includes('update')) {
              this.snotifyService.success('Data has been successfully updated.');
            }
            if (url.pathname.includes('delete')) {
              this.snotifyService.success('Data has been successfully deleted.');
            }
          }
        }


      })
    );
  }
}
