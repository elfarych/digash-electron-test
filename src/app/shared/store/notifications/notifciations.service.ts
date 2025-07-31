import { Injectable, isDevMode } from '@angular/core';
import { catchError, EMPTY, Observable, Subscription } from 'rxjs';
import { NotificationsResources } from './notifications.resources';
import { AlertNotification } from '../../models/Notification';
import { Store } from '@ngrx/store';
import { selectNotifications } from './notifications.selectors';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../../environments/environment';
import {
  NotificationsAPIActions,
  NotificationsStreamActions,
} from './notifications.actions';
import { sortNotificationsByDate } from './sortNotificationsByDate';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly notifications$: Observable<AlertNotification[]> =
    this.store.select(selectNotifications);

  private websocket!: WebSocketSubject<AlertNotification[]>;
  private subscriptions: Subscription = new Subscription();

  public requestNotifications(): Observable<AlertNotification[]> {
    return this.resources.requestNotifications();
  }

  public requestViewAll(): Observable<AlertNotification[]> {
    return this.resources.requestViewAll();
  }

  public requestRemoveAll(alertId: number): Observable<AlertNotification[]> {
    return this.resources.requestRemoveAll(alertId);
  }

  public requestTriggerAlertNotification(alertId: number): Observable<{}> {
    return this.resources.triggerAlertNotification(alertId);
  }

  public requestView(notificationId: number): Observable<{}> {
    return this.resources.requestView(notificationId);
  }

  public view(notificationId: number): void {
    this.store.dispatch(
      NotificationsAPIActions.viewNotification({ notificationId }),
    );
  }

  public getNotifications(): Observable<AlertNotification[]> {
    return this.notifications$;
  }

  public triggerSetupNotifications(): void {
    this.store.dispatch(NotificationsStreamActions.setUpNotifications());
  }

  public setupNotificationsStream(username: string): void {
    if (isDevMode()) {
      return void 0;
    }

    this.websocket?.complete();

    const createWebSocket = () => {
      this.websocket = webSocket({
        url: `${environment.wsBaseUrl}/alerts?username=${username}`,
        openObserver: {
          next: () => console.log('WebSocket connected'),
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket closed, reconnecting...');
            setTimeout(() => createWebSocket(), 5000);
          },
        },
      });

      this.subscriptions.add(
        this.websocket
          .pipe(
            catchError((e) => {
              console.log('WebSocket error:', e);
              return EMPTY;
            }),
          )
          .subscribe((data: AlertNotification[]) => {
            this.store.dispatch(
              NotificationsStreamActions.notificationsUpdate({
                data: sortNotificationsByDate(data),
              }),
            );
          }),
      );
    };

    createWebSocket();
  }

  public updateNotifications(data: AlertNotification[]): void {
    this.store.dispatch(
      NotificationsStreamActions.notificationsUpdate({
        data: sortNotificationsByDate(data),
      }),
    );
  }

  public triggerAlertNotification(alertId: number): void {
    this.store.dispatch(
      NotificationsStreamActions.triggerAlertNotification({ alertId }),
    );
  }

  public viewAll(): void {
    this.store.dispatch(NotificationsAPIActions.viewAll());
  }

  public removeAll(alertId: number): void {
    this.store.dispatch(NotificationsAPIActions.removeAll({ alertId }));
  }

  constructor(
    private resources: NotificationsResources,
    private store: Store,
  ) {}
}
