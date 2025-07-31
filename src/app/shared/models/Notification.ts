import { AlertType } from './Alert';
import { Exchange } from './Exchange';

export interface AlertNotification<
  T =
    | NotificationLimitOrderData
    | NotificationPriceData
    | NotificationPriceChangeData
    | NotificationVolatilityData
    | NotificationVolumeSplashData
    | NotificationBTCCorrelationData,
> {
  alert_type: AlertType;
  created_at: string;
  watched: boolean;
  symbol: string;
  notification_id: number;
  exchange: Exchange;
  sound_alert: boolean;
  show_chart: boolean;
  alert_sound_name: string;
  data: T;
  title?: string;
}

export interface NotificationLimitOrderData {
  price: number;
  quantity: number;
  full_price: number;
  distance: number;
  corrosion_time: number;
  created_time: number;
  living_time: number;
  order_type: 'bid' | 'ask';
}

export interface NotificationPriceData {
  price_crossing: number;
  init_price: number;
  timestamp: number;
  price?: number;
}

export interface NotificationChangeData {
  value: number;
  interval: string;
}

export interface NotificationPriceChangeData extends NotificationChangeData {
  price?: number;
}

export interface NotificationFundingData extends NotificationChangeData {
  next_funding_until_min: number;
}

export type NotificationVolatilityData = NotificationChangeData;
export type NotificationVolumeSplashData = NotificationChangeData;

export type NotificationBTCCorrelationData = NotificationChangeData;
