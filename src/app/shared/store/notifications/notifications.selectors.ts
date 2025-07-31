import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationsState } from './notification.reducer';

export const notificationsFeature =
  createFeatureSelector<NotificationsState>('notifications');

export const selectNotifications = createSelector(
  notificationsFeature,
  ({ notifications }: NotificationsState) => notifications,
);
