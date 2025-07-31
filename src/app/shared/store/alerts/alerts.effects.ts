import { Injectable } from '@angular/core';
import { AlertsProcessing } from './alerts.processing';
import { AlertsResources } from './alerts.resources';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  EMPTY,
  map,
  mergeMap,
  of,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AlertsAPIActions } from './alerts.actions';
import { Dialog } from '@angular/cdk/dialog';
import { Store } from '@ngrx/store';
import { selectAlertById, selectAlertSettings } from './alerts.selectors';
import { CookieService } from 'ngx-cookie-service';
import { Alert, PriceAlert } from '../../models/Alert';
import { NotificationsAPIActions } from '../notifications/notifications.actions';
import { extractErrorMessage } from '../../utils/extractErrorMessage';
import { MovedPriceLevelEventDetails } from '../../models/MovedPriceLevelEvent';
import { AlertSettings } from '../../models/AlertSettings';
import { AuthActions } from '../../../auth/data-access/auth.actions';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AlertsEffects {
  private loadAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AlertsAPIActions.getAlerts,
        NotificationsAPIActions.getNotificationsSuccess,
      ),
      mergeMap(() =>
        this.resources.getAlerts().pipe(
          map((data: Alert[]) => AlertsAPIActions.getAlertsSuccess({ data })),
          catchError((error) => {
            AlertsAPIActions.getAlertsError({ errorMessage: error.error });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private setAlertProcessing$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AlertsAPIActions.getAlertsSuccess),
        tap(({ data }) => {
          this.alertsProcessing.setAlerts(data as PriceAlert[]);
        }),
      ),
    { dispatch: false },
  );

  private updateAlertProcessing$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AlertsAPIActions.updateAlertSuccess,
          AlertsAPIActions.moveSignalLevelSuccess,
        ),
        tap(({ data }) => {
          this.alertsProcessing.updateAlert(data as PriceAlert);
        }),
      ),
    { dispatch: false },
  );

  private addAlertToAlertProcessing$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AlertsAPIActions.createAlertSuccess,
          AlertsAPIActions.createFastPriceAlertSuccess,
        ),
        tap(({ data }) => {
          this.alertsProcessing.addAlert(data as PriceAlert);
        }),
      ),
    { dispatch: false },
  );

  private deleteAlertFromAlertProcessing$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AlertsAPIActions.deactivateAlertSuccess,
          AlertsAPIActions.removeAlert,
        ),
        tap(({ alertId }) => {
          this.alertsProcessing.deleteAlert(alertId);
        }),
      ),
    { dispatch: false },
  );

  private loadAlertSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.getAlertSettings),
      mergeMap(() =>
        this.resources.getAlertsSettings().pipe(
          map((data: AlertSettings) =>
            AlertsAPIActions.getAlertSettingsSuccess({ data }),
          ),
          catchError((error) => {
            AlertsAPIActions.getAlertSettingsError({
              errorMessage: error.error,
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private saveAlertSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.updateAlertSettings),
      mergeMap(({ data }) =>
        this.resources.updateAlertsSettings(data).pipe(
          map((data: AlertSettings) =>
            AlertsAPIActions.updateAlertSettingsSuccess({ data }),
          ),
          catchError((error) =>
            of(
              AlertsAPIActions.updateAlertSettingsError({
                errorMessage: error.error,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // private notificationHappened$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(NotificationsStreamActions.notificationsUpdate),
  //     map(() => AlertsAPIActions.getAlerts()),
  //   ),
  // );

  private createAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.createAlert),
      mergeMap(({ data }) =>
        this.resources.createAlert(data).pipe(
          map((data: Alert) => AlertsAPIActions.createAlertSuccess({ data })),
          catchError((error) =>
            of(
              AlertsAPIActions.createAlertError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private createAlertSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AlertsAPIActions.createAlertSuccess,
          AlertsAPIActions.updateAlertSuccess,
        ),
        tap(() => this.dialog.closeAll()),
      ),
    { dispatch: false },
  );

  private createFastPriceAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.createFastPriceAlert),
      withLatestFrom(this.store.select(selectAlertSettings)),
      map(([{ value, symbol, market }, alertSettings]) => {
        const email_alert =
          !!this.cookieService.get('wintrading_EMAIL_ALERT_BY_DEFAULT') ||
          false;

        return {
          title: `${symbol} Crossing`,
          market,
          symbol,
          type: 'price',
          price_crossing: value,
          comment: '',
          values_comment: `${this.translateService.instant('alerts.parameters.coin')} ${symbol}. ${this.translateService.instant('alerts.parameters.price_crossing')} ${value}`,
          sound_alert: true,
          email_alert: undefined,
          telegram_alert: alertSettings.telegram_alerts_enabled,
          active: true,
          id: undefined,
        } as Alert;
      }),
      mergeMap((data: Alert) =>
        this.resources.createAlert(data).pipe(
          map((data: Alert) =>
            AlertsAPIActions.createFastPriceAlertSuccess({ data }),
          ),
          catchError((error) =>
            of(
              AlertsAPIActions.createFastPriceAlertError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private updateAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.updateAlert),
      tap(({ data }) => {
        if (data.email_alert) {
          this.cookieService.set('wintrading_EMAIL_ALERT_BY_DEFAULT', 'true');
        } else {
          this.cookieService.delete('wintrading_EMAIL_ALERT_BY_DEFAULT');
        }
      }),
      mergeMap(({ data, alertId }) =>
        this.resources.updateAlert(data, alertId).pipe(
          map((data: Alert) => AlertsAPIActions.updateAlertSuccess({ data })),
          catchError((error) =>
            of(
              AlertsAPIActions.updateAlertError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private moveAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.moveSignalLevel),
      concatLatestFrom(({ data }) =>
        this.store.select(selectAlertById(data.alertId)),
      ),
      map(
        ([{ data }, alert]: [
          { data: MovedPriceLevelEventDetails },
          Alert,
        ]) => ({
          data: {
            ...alert,
            price_crossing: data.newYValue,
          },
          alertId: alert.id,
        }),
      ),
      mergeMap(({ data, alertId }) =>
        this.resources.updateAlert(data, alertId).pipe(
          map((data: Alert) =>
            AlertsAPIActions.moveSignalLevelSuccess({ data }),
          ),
          catchError((error) =>
            of(
              AlertsAPIActions.moveSignalLevelError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private removeAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.removeAlert),
      mergeMap(({ alertId }) =>
        this.resources.remove(alertId).pipe(
          map((data: Alert[]) => AlertsAPIActions.removeAlertSuccess({ data })),
          catchError((error) =>
            of(
              AlertsAPIActions.removeAlertError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private activateAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.activateAlert),
      mergeMap(({ alertId }) =>
        this.resources.activate(alertId).pipe(
          map(() => AlertsAPIActions.activateAlertSuccess({ alertId })),
          catchError((error) =>
            of(
              AlertsAPIActions.activateAlertError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private deactivateAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.deactivateAlert),
      mergeMap(({ alertId }) =>
        this.resources.deactivate(alertId).pipe(
          map(() => AlertsAPIActions.deactivateAlertSuccess({ alertId })),
          catchError((error) =>
            of(
              AlertsAPIActions.deactivateAlertError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private removeAllInactiveAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsAPIActions.removeAllInactiveAlerts),
      mergeMap(() =>
        this.resources.removeAllInactiveAlerts().pipe(
          map((data) => AlertsAPIActions.removeAllInactiveSuccess({ data })),
          catchError((error) =>
            of(
              AlertsAPIActions.deactivateAlertError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setUser),
      map(() => AlertsAPIActions.getAlertSettings()),
    ),
  );

  constructor(
    private resources: AlertsResources,
    private actions$: Actions,
    private dialog: Dialog,
    private store: Store,
    private cookieService: CookieService,
    private alertsProcessing: AlertsProcessing,
    private translateService: TranslateService,
  ) {}
}
