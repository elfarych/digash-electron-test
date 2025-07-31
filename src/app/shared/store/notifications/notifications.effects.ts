import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  NotificationsAPIActions,
  NotificationsStreamActions,
} from './notifications.actions';
import { AuthActions } from '../../../auth/data-access/auth.actions';
import { EMPTY, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs';
import { NotificationsService } from './notifciations.service';
import { AlertNotification } from '../../models/Notification';
import { selectUserData } from '../../../auth/data-access/auth.selectors';
import { selectAlertSettings } from '../alerts/alerts.selectors';
import { ListingService } from '../../../pages/listing/listing.service';
import { PlatformService } from '../../../core/platform/platform.service';
import { ElectronNotificationService } from './electron-notification.service';

@Injectable()
export class NotificationsEffects {
  private getNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsAPIActions.getNotifications),
      mergeMap(() =>
        this.service.requestNotifications().pipe(
          tap((data: AlertNotification[]) => {
            const listingNotifications: AlertNotification[] = data.filter(
              (i: AlertNotification) =>
                i.alert_type === 'listing' && i.show_chart,
            );
            this.listingService.openListingNotificationsDialog(
              listingNotifications,
            );
          }),
          map((data: AlertNotification[]) =>
            NotificationsAPIActions.getNotificationsSuccess({ data }),
          ),
        ),
      ),
    ),
  );

  private viewAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsAPIActions.viewAll),
      mergeMap(() =>
        this.service
          .requestViewAll()
          .pipe(
            map((data: AlertNotification[]) =>
              NotificationsAPIActions.getNotificationsSuccess({ data }),
            ),
          ),
      ),
    ),
  );

  private removeAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsAPIActions.removeAll),
      mergeMap(({ alertId }) =>
        this.service
          .requestRemoveAll(alertId)
          .pipe(
            map((data: AlertNotification[]) =>
              NotificationsAPIActions.getNotificationsSuccess({ data }),
            ),
          ),
      ),
    ),
  );

  private triggerAlertNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsStreamActions.triggerAlertNotification),
        mergeMap(({ alertId }) =>
          this.service.requestTriggerAlertNotification(alertId),
        ),
      ),
    { dispatch: false },
  );

  private view$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsAPIActions.viewNotification),
        mergeMap(({ notificationId }) =>
          this.service.requestView(notificationId).pipe(map(() => EMPTY)),
        ),
      ),
    { dispatch: false },
  );

  private getNotificationsUpdate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.setUser,
          NotificationsStreamActions.setUpNotifications,
        ),
        withLatestFrom(this.store.select(selectUserData)),
        filter(([, user]) => !!user?.username),
        map(([, user]) =>
          this.service.setupNotificationsStream(user?.username),
        ),
      ),
    { dispatch: false },
  );

  private streamNotificationsUpdate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsStreamActions.notificationsUpdate),
        withLatestFrom(this.store.select(selectAlertSettings)),
        map(([{ data }, settings]) => {
          const audio = new Audio();

          for (const notification of data) {
            audio.pause();
            audio.currentTime = 0;

            if (notification.alert_type === 'price') {
              if (settings.alert_sound_enabled) {
                audio.src = `assets/sounds/${notification.alert_sound_name ?? 'default'}.mp3`;
                audio.load();
                audio.play();
              }
            } else {
              if (notification.sound_alert) {
                audio.src = `assets/sounds/${notification?.alert_sound_name ?? 'default'}.mp3`;
                audio.load();
                audio.play();
              }
              if (
                notification.alert_type === 'listing' &&
                notification.show_chart
              ) {
                this.listingService.openChart(
                  notification.symbol,
                  notification.exchange,
                  notification.notification_id,
                );
              }
            }
          }
        }),
      ),
    { dispatch: false },
  );

  private sendElectronNotifications$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsStreamActions.notificationsUpdate),
        withLatestFrom(this.store.select(selectAlertSettings)),
        map(([{ data }, settings]) => {
          if (this.platformService.isElectron) {
            this.electronNotificationService.sendNotifications(
              data,
              settings.alert_sound_enabled,
            );
          }
        }),
      ),
    { dispatch: false },
  );

  private authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        NotificationsStreamActions.setUpNotifications,
        AuthActions.setUser,
      ),
      map(() => NotificationsAPIActions.getNotifications()),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private service: NotificationsService,
    private listingService: ListingService,
    private platformService: PlatformService,
    private electronNotificationService: ElectronNotificationService,
  ) {}
}
