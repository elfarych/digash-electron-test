import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectAlerts,
  selectAlertsByTypes,
  selectAlertSettings,
  selectErrorMessage,
  selectNotificationsBySymbol,
  selectPriceCrossingAlerts,
  selectPriceCrossingAlertsBySymbol,
} from './alerts.selectors';
import { AlertsAPIActions } from './alerts.actions';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { AlertsResources } from './alerts.resources';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Alert, AlertType, PriceAlert } from '../../models/Alert';
import { Exchange } from '../../models/Exchange';
import { NotificationsService } from '../notifications/notifciations.service';
import { MovedPriceLevelEventDetails } from '../../models/MovedPriceLevelEvent';
import { AlertNotification } from '../../models/Notification';
import { AlertSettings } from '../../models/AlertSettings';
import { CreateAlertModalComponent } from '../../../pages/alerts/components/create-alert-modal/create-alert-modal.component';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  private readonly alerts$: Observable<Alert[]> =
    this.store.select(selectAlerts);
  private readonly priceCrossingAlerts$: Observable<Alert[]> =
    this.store.select(selectPriceCrossingAlerts);
  private readonly isAuth$: Observable<boolean> = this.authService.getIsAuth();
  private readonly errorMessage$: Observable<string> =
    this.store.select(selectErrorMessage);

  public getNotifications(): Observable<AlertNotification[]> {
    return this.notificationsService.getNotifications();
  }

  public getAlerts(): Observable<Alert[]> {
    return this.alerts$;
  }

  public getAlertsByTypes(alertTypes: AlertType[]): Observable<Alert[]> {
    return this.store.select(selectAlertsByTypes(alertTypes));
  }

  public getPriceCrossingAlerts(): Observable<Alert[]> {
    return this.priceCrossingAlerts$;
  }

  public getAlertSettings(): Observable<AlertSettings> {
    return this.store.select(selectAlertSettings);
  }

  public getPriceCrossingAlertsBySymbol(
    symbol: string,
    exchange: Exchange,
  ): Observable<Alert[]> {
    return this.store.select(
      selectPriceCrossingAlertsBySymbol(symbol, exchange),
    );
  }

  public getNotificationsBySymbol(
    symbol: string,
  ): Observable<AlertNotification[]> {
    return this.store.select(selectNotificationsBySymbol(symbol));
  }

  public loadAlerts(): void {
    this.store.dispatch(AlertsAPIActions.getAlerts());
  }

  public loadAlertSettings(): void {
    this.store.dispatch(AlertsAPIActions.getAlertSettings());
  }

  public updateAlertSettings(data: AlertSettings): void {
    this.store.dispatch(AlertsAPIActions.updateAlertSettings({ data }));
  }

  public viewAllNotifications(): void {
    this.notificationsService.viewAll();
  }

  public removeAllNotifications(alertId: number): void {
    this.notificationsService.removeAll(alertId);
  }

  public selectNotification(notification: AlertNotification): void {
    this.notificationsService.view(notification.notification_id);
  }

  public moveSignalLevel(data: MovedPriceLevelEventDetails): void {
    this.store.dispatch(AlertsAPIActions.moveSignalLevel({ data }));
  }

  public createFastSignalLevelAlert(
    value: number,
    symbol: string,
    market: Exchange,
  ): void {
    this.store.dispatch(
      AlertsAPIActions.createFastPriceAlert({ value, symbol, market }),
    );
  }

  public clear(): void {
    this.store.dispatch(AlertsAPIActions.clear());
  }

  public async removeInactivePriceAlerts(): Promise<void> {
    // await this.confirmationPopup.confirm("Удалить все неактивные оповещения?");
    this.store.dispatch(AlertsAPIActions.removeAllInactiveAlerts());
  }

  public createAlert(data: Alert): void {
    this.store.dispatch(AlertsAPIActions.createAlert({ data }));
  }

  public editAlert(data: Alert, alertId: number): void {
    this.store.dispatch(AlertsAPIActions.updateAlert({ data, alertId }));
  }

  public isAuth(): Observable<boolean> {
    return this.isAuth$;
  }

  public getErrorMessage(): Observable<string> {
    return this.errorMessage$;
  }

  public movePriceLevelAlert(data: MovedPriceLevelEventDetails): void {
    this.store.dispatch(AlertsAPIActions.moveSignalLevel({ data }));
  }

  public async remove(alertId: number): Promise<void> {
    // await this.confirmationPopup.confirm('Удалить сигнальный уровень?');
    this.store.dispatch(AlertsAPIActions.removeAlert({ alertId }));
  }

  public activate(alertId: number): void {
    this.store.dispatch(AlertsAPIActions.activateAlert({ alertId }));
  }

  public deactivate(alertId: number): void {
    this.store.dispatch(AlertsAPIActions.deactivateAlert({ alertId }));
  }

  public triggerPriceAlert(data: PriceAlert): void {
    this.store.dispatch(AlertsAPIActions.triggerPriceAlert({ data }));
  }

  public openAlertModal(
    alert: Alert | undefined,
    edit = false,
    alertType: AlertType | null,
  ): void {
    const dialogRef: DialogRef = this.dialog.open(CreateAlertModalComponent, {
      data: {
        edit,
        alert,
        alertType,
      },
      width: '720px',
      height: 'auto',
      panelClass: 'digash-dialog',
    });
  }

  constructor(
    private store: Store,
    private notificationsService: NotificationsService,
    private dialog: Dialog,
    private resources: AlertsResources,
    private authService: AuthService,
  ) {}
}
