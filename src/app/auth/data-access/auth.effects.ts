import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { AuthActions, RestoreActions, UserActions } from './auth.actions';
import {
  catchError,
  EMPTY,
  filter,
  interval,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { UserData, UserToken } from '../../shared/models/Auth';
import { select, Store } from '@ngrx/store';
import { selectRefreshToken, selectUserPreferences } from './auth.selectors';
import { SocialUser } from '@abacritt/angularx-social-login';
import { MessageService } from 'primeng/api';
import { ReferralsService } from 'src/app/pages/profile/referrals/components/referrals/referrals.service';

@Injectable()
export class AuthEffects {
  private loadUserData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadUserData),
      mergeMap(() =>
        this.authService.loadUserData().pipe(
          map((data: UserData) => AuthActions.setUser(data)),
          catchError(({ error }) => of(AuthActions.logout())),
        ),
      ),
    );
  });

  private login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) => {
        return this.authService.login(username, password).pipe(
          tap(({ access, refresh }) =>
            this.authService.setStoreAuthTokens(access, refresh),
          ),
          switchMap((data: UserToken) => [
            AuthActions.setTokens(data),
            AuthActions.loadUserData(),
            AuthActions.loginSuccess(),
          ]),
          catchError(({ error }) =>
            of(
              AuthActions.loginError({
                errorMessage: error,
              }),
            ),
          ),
        );
      }),
    );
  });

  private register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ username, password, email }) => {
        return this.authService.register(username, password, email).pipe(
          switchMap(
            ({ status, message }: { status: string; message: string }) => {
              return [
                AuthActions.showBanner({ bannerType: 'success', message }),
                AuthActions.login({
                  username,
                  password,
                }),
              ];
            },
          ),
          catchError((errorMessage) => {
            return of(AuthActions.registerError({ errorMessage }));
          }),
        );
      }),
    );
  });

  private authGoogle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.authGoogle),
      mergeMap(({ user }: { user: SocialUser }) =>
        this.authService.authGoogle(user).pipe(
          tap(({ access, refresh }) =>
            this.authService.setStoreAuthTokens(access, refresh),
          ),
          switchMap((data: UserToken) => [
            AuthActions.setTokens(data),
            AuthActions.loadUserData(),
            AuthActions.loginSuccess(),
            data.new_user
              ? AuthActions.showBanner({
                  bannerType: 'success',
                  message: this.translateService.instant('auth.welcome'),
                })
              : null,
          ]),
          catchError((error) => {
            return of(AuthActions.loginError({ errorMessage: error?.detail }));
          }),
        ),
      ),
    );
  });

  private authSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.authService.closeAuthPopup()),
      );
    },
    { dispatch: false },
  );

  private logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.authService.deleteStoreAuthTokens()),
      );
    },
    { dispatch: false },
  );

  private refresh$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      withLatestFrom(this.store.pipe(select(selectRefreshToken))),
      filter(([_, refresh]) => Boolean(refresh)),
      switchMap(([_, refresh]) => {
        return this.authService.refresh(refresh).pipe(
          tap(({ access, refresh }) =>
            this.authService.setStoreAuthTokens(access, refresh),
          ),
          map((data: UserToken) => AuthActions.setTokens(data)),
        );
      }),
    );
  });

  private pingRefreshToken$ = createEffect(() => {
    return interval(240000).pipe(map(() => AuthActions.refreshToken()));
  });

  private init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.authInit),
      map(() => this.authService.getStoreAuthTokens()),
      switchMap((tokens: string) => {
        if (!tokens) {
          this.referralsService.handleReferralSession();
          this.referralsService.handleReferralFriendSession();
          return of(AuthActions.authTryHappened());
        }

        const data: UserToken = JSON.parse(tokens);

        return this.authService.verify(data.access).pipe(
          switchMap(() => [
            AuthActions.setTokens(data),
            AuthActions.loadUserData(),
          ]),
          catchError((err) => {
            if (
              err.error.error &&
              err.error.error?.length &&
              err.error.error[0].includes('Invalid payload')
            ) {
              return of(AuthActions.logout());
            }

            if (
              err?.error?.code &&
              err.error.code.includes('token_not_valid')
            ) {
              return of(AuthActions.logout());
            }

            if (
              err?.error?.code &&
              err.error.code.includes('token_not_valid')
            ) {
              return of(AuthActions.logout());
            }

            return this.authService.refresh(data.refresh).pipe(
              tap(({ access, refresh }) =>
                this.authService.setStoreAuthTokens(access, refresh),
              ),
              switchMap((newTokens: UserToken) => [
                AuthActions.setTokens(newTokens),
                AuthActions.loadUserData(),
              ]),
            );
          }),
        );
      }),
    );
  });

  private restoreEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RestoreActions.restoreEmail),
      mergeMap(({ email }) =>
        this.authService.restoreEmail(email).pipe(
          map(() => RestoreActions.restoreEmailSuccess()),
          catchError(({ error }) =>
            of(
              RestoreActions.restoreEmailError({ errorMessage: error.status }),
            ),
          ),
        ),
      ),
    );
  });

  private restoreCode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RestoreActions.restoreCode),
      mergeMap(({ email, code }) =>
        this.authService.restoreCode(code, email).pipe(
          map(() => RestoreActions.restoreCodeSuccess()),
          catchError(({ error }) =>
            of(RestoreActions.restoreCodeError({ errorMessage: error.status })),
          ),
        ),
      ),
    );
  });

  private restoreNewPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RestoreActions.restoreNewPassword),
      mergeMap(({ email, code, password }) =>
        this.authService.restorePassword(code, email, password).pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('auth.hooray'),
              detail: this.translateService.instant(
                'auth.password_congratulations',
              ),
            });
          }),
          map(() => RestoreActions.restoreNewPasswordSuccess()),
          catchError(({ error }) =>
            of(
              RestoreActions.restoreNewPasswordError({
                errorMessage: error.status,
              }),
            ),
          ),
        ),
      ),
    );
  });

  private updateTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.updateTheme),
        withLatestFrom(this.store.pipe(select(selectUserPreferences))),
        switchMap(([{ data }, userPreferences]) =>
          this.authService
            .updateUserPreferences({ ...userPreferences, theme: data })
            .pipe(map(() => EMPTY)),
        ),
      ),
    { dispatch: false },
  );

  private registerError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerError),
      map(({ errorMessage }) => {
        return AuthActions.setRegisterErrorMessage({ errorMessage });
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private store: Store,
    private messageService: MessageService,
    private referralsService: ReferralsService,
    private translateService: TranslateService,
  ) {}
}
