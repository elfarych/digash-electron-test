import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AlertNotification } from '../../models/Notification';

export const NotificationsAPIActions = createActionGroup({
  source: 'Notifications API actions',
  events: {
    'Get notifications': emptyProps(),
    'Get notifications success': props<{ data: AlertNotification[] }>(),

    'View all': emptyProps(),
    'Remove all': props<{ alertId: number }>(),
    'View notification': props<{ notificationId: number }>(),
  },
});

export const NotificationsStreamActions = createActionGroup({
  source: 'Notifications stream actions',
  events: {
    'Set up notifications': emptyProps(),
    'Trigger alert notification': props<{ alertId: number }>(),
    'Notifications update': props<{ data: AlertNotification[] }>(),
  },
});
