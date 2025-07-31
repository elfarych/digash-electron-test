import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { first, mergeMap, Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this.authService.getAccessToken().pipe(
      first(),
      mergeMap((access: string) => {
        if (
          !request.url.includes('api.binance.com') &&
          !request.url.includes('fapi.binance.com') &&
          !request.url.includes('api.bitget.com') &&
          access
        ) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${access}`,
            },
          });
        }

        return next.handle(request);
      }),
    );
  }
}
