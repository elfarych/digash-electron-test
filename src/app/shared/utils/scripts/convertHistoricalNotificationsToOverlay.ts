import { Overlay } from 'night-vision/dist/types';
import {
  AlertNotification,
  NotificationBTCCorrelationData,
  NotificationLimitOrderData,
  NotificationPriceChangeData,
  NotificationPriceData,
  NotificationVolatilityData,
  NotificationVolumeSplashData,
} from '../../models/Notification';
import { roundDate } from '../roundDate';
import { convertPrice } from '../priceConverter';
import { CandlestickIntervals } from '../../models/Candlestick';

export const convertHistoricalNotificationsToOverlayData = (
  notifications: AlertNotification[],
  interval: CandlestickIntervals,
) => {
  const priceNotifications = notifications
    .filter(
      (notification: AlertNotification) => notification.alert_type === 'price',
    )
    .map((notification: AlertNotification<NotificationPriceData>) => [
      roundDate(new Date(notification.created_at), interval).getTime(),
      [
        notification.data?.init_price > notification.data.price_crossing
          ? 1
          : -1,
        `${notification.title?.replace(' Crossing', '')} -  ${notification.data.price_crossing}$`,
      ],
    ]);

  const limitOrdersNotifications = notifications
    .filter(
      (notification: AlertNotification) =>
        notification.alert_type === 'limitOrder',
    )
    .map((notification: AlertNotification<NotificationLimitOrderData>) => [
      roundDate(new Date(notification.created_at), interval).getTime(),
      [
        1,
        `${notification.title} - ${convertPrice(notification.data.full_price)}$`,
      ],
    ]);

  const priceChangeNotifications = notifications
    .filter(
      (notification: AlertNotification) =>
        notification.alert_type === 'priceChange',
    )
    .map((notification: AlertNotification<NotificationPriceChangeData>) => [
      roundDate(new Date(notification.created_at), interval).getTime(),
      [1, `${notification.title} ${notification.data.value.toFixed(1)}%`],
    ]);

  const volumeSplashNotifications = notifications
    .filter(
      (notification: AlertNotification) =>
        notification.alert_type === 'volumeSplash',
    )
    .map((notification: AlertNotification<NotificationVolumeSplashData>) => [
      roundDate(new Date(notification.created_at), interval).getTime(),
      [1, `${notification.title} ${notification.data.value.toFixed(1)}`],
    ]);

  const volatilityNotifications = notifications
    .filter(
      (notification: AlertNotification) =>
        notification.alert_type === 'volatility',
    )
    .map((notification: AlertNotification<NotificationVolatilityData>) => [
      roundDate(new Date(notification.created_at), interval).getTime(),
      [1, `${notification.title} ${notification.data.value.toFixed(1)}`],
    ]);

  const correlationNotifications = notifications
    .filter(
      (notification: AlertNotification) =>
        notification.alert_type === 'btcCorrelation',
    )
    .map((notification: AlertNotification<NotificationBTCCorrelationData>) => [
      roundDate(new Date(notification.created_at), interval).getTime(),
      [1, `${notification.title} ${notification.data.value.toFixed(1)}`],
    ]);

  return [
    ...priceNotifications,
    ...limitOrdersNotifications,
    ...priceChangeNotifications,
    ...volumeSplashNotifications,
    ...volatilityNotifications,
    ...correlationNotifications,
  ];
};

export const convertHistoricalNotificationsToOverlay = (
  notifications: AlertNotification[],
  interval: CandlestickIntervals,
): Overlay => {
  const priceNotifications = notifications
    .filter(
      (notification: AlertNotification) => notification.alert_type === 'price',
    )
    .map((notification: AlertNotification<NotificationPriceData>) => [
      roundDate(new Date(notification.created_at), interval).getTime(),
      [
        notification.data?.init_price > notification.data.price_crossing
          ? 1
          : -1,
        'Price crossing - ' + notification.data.price_crossing,
      ],
    ]);

  const limitOrdersNotifications = notifications
    .filter(
      (notification: AlertNotification) =>
        notification.alert_type === 'limitOrder',
    )
    .map((notification: AlertNotification<NotificationLimitOrderData>) => [
      roundDate(new Date(notification.created_at), interval).getTime(),
      [1, `Limit order - ${convertPrice(notification.data.full_price)}`],
    ]);

  const data = [...priceNotifications, ...limitOrdersNotifications];

  return {
    name: 'Notifications',
    type: 'ArrowTrades',
    props: {
      buyColor: 'rgb(59, 130, 246)',
      sellColor: 'rgb(59, 130, 246)',
      size: 8,
    },
    data,
  };
};
