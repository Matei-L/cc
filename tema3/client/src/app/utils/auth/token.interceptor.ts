import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import {switchMap, take} from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getIdToken().pipe(
      switchMap((token: any) => {
        take(1);
        if (token) {
          request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        }
        return next.handle(request);
      }));
  }
}
