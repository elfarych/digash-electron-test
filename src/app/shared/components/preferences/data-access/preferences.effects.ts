import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Dialog } from '@angular/cdk/dialog';
import { PreferencesService } from './preferences.service';
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs';
import { PreferencesActions } from './preferences.actions';
import { AuthActions } from '../../../../auth/data-access/auth.actions';
import { WorkspaceActions } from '../../../../pages/charts-screener/data-access/workspace.actions';

@Injectable()
export class PreferencesEffects {
  constructor(
    private actions$: Actions,
    private service: PreferencesService,
    private store: Store,
    private dialog: Dialog,
  ) {}

  private loadPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PreferencesActions.loadPreferences),
      switchMap(() =>
        this.service.getPreferencesAPI().pipe(
          map((data) => PreferencesActions.loadPreferencesSuccess({ data })),
          catchError(() => {
            PreferencesActions.loadPreferencesError({
              errorMessage: 'Произошла ошибка во время загрузки данных',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private editPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PreferencesActions.updatePreferences),
      switchMap(({ data }) =>
        this.service.updatePreferencesAPI(data).pipe(
          map((data) => PreferencesActions.updatePreferencesSuccess({ data })),
          catchError(() => {
            PreferencesActions.updatePreferencesError({
              errorMessage:
                'Произошла ошибка во время редактирования оформления',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setTokens),
      map(() => PreferencesActions.loadPreferences()),
    ),
  );
}
