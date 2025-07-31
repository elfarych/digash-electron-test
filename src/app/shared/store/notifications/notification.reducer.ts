import { createReducer, on } from '@ngrx/store';
import { AlertNotification } from '../../models/Notification';
import {
  NotificationsAPIActions,
  NotificationsStreamActions,
} from './notifications.actions';

export interface NotificationsState {
  notifications: AlertNotification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

export const notificationsReducer = createReducer(
  initialState,

  on(NotificationsAPIActions.getNotificationsSuccess, (state, { data }) => ({
    ...state,
    notifications: data,
  })),

  on(NotificationsAPIActions.viewNotification, (state, { notificationId }) => {
    return {
      ...state,
      notifications: [
        ...state.notifications.map((value) =>
          value.notification_id === notificationId
            ? {
                ...value,
                watched: true,
              }
            : value,
        ),
      ],
    };
  }),

  on(NotificationsStreamActions.notificationsUpdate, (state, { data }) => {
    return {
      ...state,
      notifications: [...data, ...state.notifications],
    };
  }),
);
