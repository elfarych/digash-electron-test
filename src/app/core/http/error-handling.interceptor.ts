import { Injectable } from '@angular/core';
import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/data-access/auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { PremiumForbiddenDialogService } from '../../shared/components/premium-forbidden-dialog/premium-forbidden-dialog.service';

export const IGNORE_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(
    public authService: AuthService,
    private premiumForbiddenDialogService: PremiumForbiddenDialogService,
    private translateService: TranslateService,
    private messageService: MessageService,
  ) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const ignoreInterceptor = request.context.get(IGNORE_INTERCEPTOR);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (ignoreInterceptor) {
          return throwError(() => error);
        }

        const errorMessage =
          error?.error?.error ??
          error?.error?.message ??
          error?.error?.status ??
          error?.error?.code ??
          error?.error?.detail ??
          error;

        if (error.status === 403) {
          const forbiddenError =
            error?.error?.error ??
            error?.error?.message ??
            error?.error?.status;

          this.premiumForbiddenDialogService.open(
            this.translateService.instant(
              forbiddenError
                ? `ERROR_CODES.${forbiddenError}`
                : 'ERROR_CODES.PREMIUM_FORBIDDEN',
            ),
          );
        }
        if (typeof errorMessage === 'string') {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('ERROR_CODES.ERROR'),
            detail: this.translateService
              .instant(`ERROR_CODES.${errorMessage}`)
              ?.replace('ERROR_CODES.', ''),
          });
        }
        return throwError(() =>
          this.translateService.instant(`ERROR_CODES.${errorMessage}`),
        );
      }),
    );
  }
}
