import { AlertNotification } from '../../models/Notification';

export const sortNotificationsByDate = (
  data: AlertNotification[],
): AlertNotification[] => {
  return data.sort((a, b) => {
    if (new Date(a.created_at) < new Date(b.created_at)) {
      return -1;
    }

    if (new Date(a.created_at) > new Date(b.created_at)) {
      return 1;
    }

    return 0;
  });
};
