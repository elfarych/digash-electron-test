import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Alert } from '../../models/Alert';
import { AlertsState } from './alerts.reducer';
import { Exchange } from '../../models/Exchange';

export const alertsFeature = createFeatureSelector<AlertsState>('alerts');

export const selectAlerts = createSelector(
  alertsFeature,
  ({ alerts }: AlertsState) => alerts,
);

export const selectAlertsByTypes = (alertTypes: string[] = ['price']) =>
  createSelector(alertsFeature, ({ alerts }: AlertsState) =>
    alerts.filter((i) => alertTypes.includes(i.type)),
  );

export const selectAlertSettings = createSelector(
  alertsFeature,
  (state: AlertsState) => state.settings,
);

export const selectAlertById = (alertId: number) =>
  createSelector(selectAlerts, (alerts: Alert[]) =>
    alerts.find((alert: Alert) => alert.id === alertId),
  );

export const selectPriceCrossingAlerts = createSelector(
  selectAlerts,
  (alerts: Alert[]) =>
    alerts.filter((alert: Alert) => alert.type === 'price' && alert.active),
);

export const selectPriceCrossingAlertsBySymbol = (
  symbol: string,
  exchange: Exchange,
) =>
  createSelector(selectAlerts, (alerts: Alert[]) =>
    alerts.filter(
      (alert: Alert) =>
        alert.type === 'price' &&
        alert?.symbol?.toUpperCase() === symbol.toUpperCase() &&
        alert.market === exchange &&
        alert.active,
    ),
  );

export const selectNotificationsBySymbol = (symbol: string) =>
  createSelector(selectAlerts, (alerts: Alert[]) => {
    const priceCrossingAlerts = alerts.filter(
      (alert: Alert) =>
        alert.type === 'price' &&
        alert?.symbol?.toUpperCase() === symbol.toUpperCase(),
    );
    const priceCrossingAlertsNotifications = priceCrossingAlerts.flatMap(
      (alert) => alert.notifications,
    );
    const notifications = [];
    for (const alert of alerts) {
      for (const notification of alert?.notifications ?? []) {
        if (notification.symbol?.toUpperCase() === symbol.toUpperCase()) {
          notifications.push(notification);
        }
      }
    }

    return [...notifications, ...priceCrossingAlertsNotifications];
  });

export const selectErrorMessage = createSelector(
  alertsFeature,
  (state: AlertsState) => {
    if (typeof state.errorMessage === 'object') {
      return Object.values(state.errorMessage).join(', ');
    }
    return state.errorMessage;
  },
);
