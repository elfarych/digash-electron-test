import { createReducer, on } from '@ngrx/store';
import { AlertsAPIActions } from './alerts.actions';
import { Alert } from '../../models/Alert';
import { AlertSettings } from '../../models/AlertSettings';

export interface AlertsState {
  alerts: Alert[];
  loading: boolean;
  errorMessage: string;
  settings: AlertSettings;
}

const initialState: AlertsState = {
  alerts: [],
  loading: false,
  errorMessage: undefined,
  settings: undefined,
};

export const alertsReducer = createReducer(
  initialState,

  on(AlertsAPIActions.getAlertsSuccess, (state, { data }) => ({
    ...state,
    errorMessage: undefined,
    alerts: data,
  })),

  on(AlertsAPIActions.triggerPriceAlert, (state, { data }) => ({
    ...state,
    alerts: JSON.parse(JSON.stringify(state.alerts)).map((a) => {
      if (a.id === data.id) a.active = false;
      return a;
    }),
  })),

  on(AlertsAPIActions.removeAllInactiveSuccess, (state, { data }) => ({
    ...state,
    errorMessage: undefined,
    alerts: data,
  })),

  on(AlertsAPIActions.clear, (state) => ({
    ...state,
    errorMessage: undefined,
  })),

  on(
    AlertsAPIActions.createAlertSuccess,
    AlertsAPIActions.createFastPriceAlertSuccess,
    (state, { data }) => ({
      ...state,
      errorMessage: undefined,
      alerts: [data, ...state.alerts],
    }),
  ),

  on(
    AlertsAPIActions.updateAlertSuccess,
    AlertsAPIActions.moveSignalLevelSuccess,
    (state, { data }) => ({
      ...state,
      alerts: [
        ...state.alerts.map((value) => (value.id === data.id ? data : value)),
      ],
    }),
  ),

  on(
    AlertsAPIActions.createAlertError,
    AlertsAPIActions.getAlertSettingsError,
    AlertsAPIActions.updateAlertSettingsError,
    AlertsAPIActions.updateAlertError,
    AlertsAPIActions.createFastPriceAlertError,
    AlertsAPIActions.moveSignalLevelError,
    (state, { errorMessage }) => {
      return {
        ...state,
        errorMessage,
        loading: false,
      };
    },
  ),

  on(AlertsAPIActions.removeAlertSuccess, (state, { data }) => ({
    ...state,
    errorMessage: undefined,
    alerts: data,
  })),

  on(AlertsAPIActions.activateAlertSuccess, (state, { alertId }) => ({
    ...state,
    alerts: [
      ...state.alerts.map((value) =>
        value.id === alertId
          ? {
              ...value,
              active: true,
            }
          : value,
      ),
    ],
  })),

  on(AlertsAPIActions.deactivateAlertSuccess, (state, { alertId }) => ({
    ...state,
    alerts: [
      ...state.alerts.map((value) =>
        value.id === alertId
          ? {
              ...value,
              active: false,
            }
          : value,
      ),
    ],
  })),

  on(
    AlertsAPIActions.moveSignalLevel,
    AlertsAPIActions.getAlertSettings,
    AlertsAPIActions.updateAlertSettings,
    AlertsAPIActions.createAlert,
    AlertsAPIActions.updateAlert,
    AlertsAPIActions.createFastPriceAlert,
    (state) => ({
      ...state,
      errorMessage: undefined,
      loading: true,
    }),
  ),

  on(AlertsAPIActions.getAlertSettingsSuccess, (state, { data }) => ({
    ...state,
    settings: data,
    loading: false,
  })),

  on(AlertsAPIActions.updateAlertSettings, (state, { data }) => ({
    ...state,
    settings: data,
  })),
);
