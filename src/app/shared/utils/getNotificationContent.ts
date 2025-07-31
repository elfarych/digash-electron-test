import {
  AlertNotification,
  NotificationFundingData,
  NotificationLimitOrderData,
  NotificationPriceChangeData,
  NotificationPriceData,
  NotificationVolatilityData,
  NotificationVolumeSplashData,
} from '../models/Notification';
import { TranslateService } from '@ngx-translate/core';
import { convertNumber } from './convertNumber';

export const getNotificationContent = (
  notification: AlertNotification,
  translateService: TranslateService,
): string => {
  if (notification.alert_type === 'price') {
    const priceGrossingData = notification.data as NotificationPriceData;
    return `${notification.symbol} ${translateService.instant('alerts.priceCrossed')} ${priceGrossingData.price_crossing}$`;
  } else if (notification.alert_type === 'limitOrder') {
    const limitOrderData = notification.data as NotificationLimitOrderData;
    return `${translateService.instant('alerts.orderType', { type: limitOrderData.order_type === 'ask' ? translateService.instant('alerts.sell') : translateService.instant('alerts.buy') })} $${convertNumber(limitOrderData.full_price)} ${translateService.instant('alerts.atPrice')} - ${limitOrderData.price}<br>
        ${translateService.instant('alerts.distance')}: ${limitOrderData.distance.toFixed(2)}%<br>
        ${translateService.instant('alerts.corrosionTime')}: ${limitOrderData.corrosion_time} ${translateService.instant('alerts.minutes')}<br>
        ${translateService.instant('alerts.lifetime')}: ${limitOrderData.living_time?.toFixed(1)} ${translateService.instant('alerts.minutes')}
      `;
  } else if (notification.alert_type === 'priceChange') {
    const priceChangeData = notification.data as NotificationPriceChangeData;
    return `${translateService.instant('alerts.priceChange')}: ${priceChangeData?.value?.toFixed(2)}%<br>${translateService.instant('alerts.interval')}: ${priceChangeData.interval?.split('_')[1] || ''}`;
  } else if (notification.alert_type === 'volatility') {
    const volatilityData = notification.data as NotificationVolatilityData;
    return `${translateService.instant('alerts.volatility')}: ${volatilityData?.value?.toFixed(2)}%<br>${translateService.instant('alerts.interval')}: ${volatilityData.interval?.split('_')[1] || ''}`;
  } else if (notification.alert_type === 'btcCorrelation') {
    const btcCorrelation = notification.data as NotificationVolatilityData;
    return `${translateService.instant('alerts.correlation')}: ${btcCorrelation?.value?.toFixed(2)}%<br>${translateService.instant('alerts.interval')}: ${btcCorrelation.interval?.split('_')[1] || ''}`;
  } else if (notification.alert_type === 'volumeSplash') {
    const volumeSplash = notification.data as NotificationVolumeSplashData;
    return `${translateService.instant('alerts.volumeSplash')}: х${volumeSplash?.value?.toFixed(2)}<br>${translateService.instant('alerts.interval')}: ${volumeSplash.interval?.split('_')[1] || ''}`;
  } else if (notification.alert_type === 'funding') {
    const funding = notification.data as NotificationFundingData;
    return `${translateService.instant('alerts.funding')}: ${funding?.value?.toFixed(2)}%<br>${translateService.instant('alerts.funding_parameters.nextFundingTime')}: ${funding.next_funding_until_min.toFixed(0)} ${translateService.instant('alerts.minutes')}`;
  }

  return notification.symbol;
};
