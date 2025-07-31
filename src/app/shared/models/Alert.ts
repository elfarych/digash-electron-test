import { Exchange } from './Exchange';
import { AlertNotification } from './Notification';
import { DropdownOptions } from '../types/base.types';
import { defaultAlertSettings } from './AlertSettings';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export type Alert =
  | BTCCorrelationAlert
  | PriceChangeAlert
  | LimitOrderAlert
  | ListingAlert
  | VolumeSplashAlert
  | PriceAlert;
export type AlertType =
  | 'all'
  | 'limitOrder'
  | 'price'
  | 'priceChange'
  | 'btcCorrelation'
  | 'volatility'
  | 'volumeSplash'
  | 'listing'
  | 'funding';
export type AlertIntervalType =
  | 'interval_1m'
  | 'interval_3m'
  | 'interval_5m'
  | 'interval_15m'
  | 'interval_30m'
  | 'interval_1h'
  | 'interval_2h'
  | 'interval_6h'
  | 'interval_12h'
  | 'interval_24h';
export type VolumeSplashAlertIntervalType =
  | 'interval_5m'
  | 'interval_10m'
  | 'interval_15m'
  | 'interval_20m'
  | 'interval_30m'
  | 'interval_1h'
  | 'interval_2h'
  | 'interval_6h'
  | 'interval_12h'
  | 'interval_24h';
export type AlertPriceChangeDirectionType = 'up' | 'down' | 'all';
export type AlertFundingDirectionType = 'negative' | 'positive' | 'all';
export type AlertSoundType =
  | 'default'
  | 'sound_2'
  | 'sound_3'
  | 'sound_4'
  | 'sound_5'
  | 'sound_6'
  | 'sound_7'
  | 'sms'
  | 'sound_8'
  | 'sound_9'
  | 'sound_10'
  | 'sound_11'
  | 'sound_12';

interface BaseAlert {
  uuid?: string;
  id: number;
  title: string;
  comment: string;
  values_comment?: string;
  market: Exchange;
  type: AlertType;
  active: boolean;
  created_at?: string;

  sound_alert: boolean;
  alert_sound_name?: string;
  email_alert: boolean;
  telegram_alert: boolean;
  show_chart_dialog: boolean;

  symbols?: string;

  ignore_symbols?: string;
  watchlist_symbols?: boolean;
  all_symbols?: boolean;

  // Alert oldValues
  symbol?: string;
  price_crossing?: number;
  init_price?: number;

  notifications?: AlertNotification[];

  volume_filter_interval?: AlertIntervalType;
  volume_filter_from?: number;
  volume_filter_to?: number;
}

interface ChangeAlert {
  value: number;
  interval: AlertIntervalType;
}

export interface BTCCorrelationAlert extends ChangeAlert, BaseAlert {}

export interface ListingAlert extends BaseAlert {}

export interface VolatilityAlert extends ChangeAlert, BaseAlert {}
export interface VolumeSplashAlert extends ChangeAlert, BaseAlert {
  price_direction: AlertPriceChangeDirectionType;
  price_change_from: number;
  price_change: boolean;
}

export interface PriceChangeAlert extends ChangeAlert, BaseAlert {
  direction: AlertPriceChangeDirectionType;
}

export interface FundingAlert extends ChangeAlert, BaseAlert {
  direction: AlertFundingDirectionType;
  until_next_funding_minutes: number;
}

export interface LimitOrderAlert extends BaseAlert {
  size: number;
  corrosion_time: number;
  living_time: number;
  distance: number;
  round_density: boolean;
}

export interface PriceAlert extends BaseAlert {
  symbol: string;
  price_crossing: number;
  init_price?: number;
}

export const AlertTypes = (
  translateService: TranslateService,
): DropdownOptions<AlertType> => [
  { value: 'limitOrder', label: translateService.instant('alerts.limitOrder') },
  {
    value: 'priceChange',
    label: translateService.instant('alerts.priceChange'),
  },
  {
    value: 'btcCorrelation',
    label: translateService.instant('alerts.btcCorrelation'),
  },
  {
    value: 'volatility',
    label: translateService.instant('alerts.volatility2'),
  },
  {
    value: 'volumeSplash',
    label: translateService.instant('alerts.volumeSplash'),
  },
  { value: 'listing', label: translateService.instant('alerts.listing') },
  { value: 'funding', label: translateService.instant('alerts.funding') },
];

export const AlertIntervalOptions = (
  translateService: TranslateService,
): DropdownOptions<AlertIntervalType> => [
  { value: 'interval_1m', label: translateService.instant('intervals.1m') },
  { value: 'interval_3m', label: translateService.instant('intervals.3m') },
  { value: 'interval_5m', label: translateService.instant('intervals.5m') },
  { value: 'interval_15m', label: translateService.instant('intervals.15m') },
  { value: 'interval_30m', label: translateService.instant('intervals.30m') },
  { value: 'interval_1h', label: translateService.instant('intervals.1h') },
  { value: 'interval_2h', label: translateService.instant('intervals.2h') },
  { value: 'interval_6h', label: translateService.instant('intervals.6h') },
  { value: 'interval_12h', label: translateService.instant('intervals.12h') },
  { value: 'interval_24h', label: translateService.instant('intervals.24h') },
];

export const volumeSplashAlertIntervalOptions = (
  translateService: TranslateService,
): DropdownOptions<VolumeSplashAlertIntervalType> => [
  { value: 'interval_5m', label: translateService.instant('intervals.5m') },
  { value: 'interval_10m', label: translateService.instant('intervals.10m') },
  { value: 'interval_15m', label: translateService.instant('intervals.15m') },
  { value: 'interval_20m', label: translateService.instant('intervals.20m') },
  { value: 'interval_30m', label: translateService.instant('intervals.30m') },
  { value: 'interval_1h', label: translateService.instant('intervals.1h') },
  { value: 'interval_2h', label: translateService.instant('intervals.2h') },
  { value: 'interval_6h', label: translateService.instant('intervals.6h') },
  { value: 'interval_12h', label: translateService.instant('intervals.12h') },
  { value: 'interval_24h', label: translateService.instant('intervals.24h') },
];

export const AlertPriceChangeTypeOptions = (
  translateService: TranslateService,
): DropdownOptions<AlertPriceChangeDirectionType> => [
  { value: 'up', label: translateService.instant('priceDirection.up') },
  { value: 'down', label: translateService.instant('priceDirection.down') },
  { value: 'all', label: translateService.instant('priceDirection.all') },
];

export const AlertFundingTypeOptions = (
  translateService: TranslateService,
): DropdownOptions<AlertFundingDirectionType> => [
  {
    value: 'positive',
    label: translateService.instant('fundingDirection.positive'),
  },
  {
    value: 'negative',
    label: translateService.instant('fundingDirection.negative'),
  },
  { value: 'all', label: translateService.instant('fundingDirection.all') },
];

export const patchAlertBaseValues = (alert: Alert) => {
  return {
    email_alert: alert.email_alert,
    sound_alert: alert.sound_alert,
    alert_sound_name:
      alert.alert_sound_name ?? defaultAlertSettings.alert_sound_name,

    telegram_alert: alert.telegram_alert,
    show_chart_dialog: alert.show_chart_dialog,

    market: alert.market,
    title: alert.title,
    comment: alert.comment,
    values_comment: alert.values_comment,

    watchlist_symbols: alert.watchlist_symbols,
    all_symbols: alert.all_symbols,
    symbols: alert.symbols,
    ignore_symbols: alert.ignore_symbols,
    volume_filter_interval: alert.volume_filter_interval,
    volume_filter_from: alert.volume_filter_from,
    volume_filter_to: alert.volume_filter_to,
  };
};

export const baseAlertForm = (alertType: AlertType | null = null) => {
  if (alertType === 'listing') {
    return new FormGroup({
      sound_alert: new FormControl(true),
      alert_sound_name: new FormControl(defaultAlertSettings.alert_sound_name),
      email_alert: new FormControl(false),
      telegram_alert: new FormControl(false),
      show_chart_dialog: new FormControl(false),
      market: new FormControl('ALL', [Validators.required]),
      title: new FormControl('Листинг', [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(80),
      ]),
      all_symbols: new FormControl(true),
    });
  }

  return new FormGroup({
    sound_alert: new FormControl(true),
    alert_sound_name: new FormControl(defaultAlertSettings.alert_sound_name),
    email_alert: new FormControl(false),
    telegram_alert: new FormControl(false),
    show_chart_dialog: new FormControl(false),
    values_comment: new FormControl(''),

    market: new FormControl('BINANCE_SPOT', [Validators.required]),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(0),
      Validators.maxLength(80),
    ]),
    comment: new FormControl('', [
      Validators.minLength(0),
      Validators.maxLength(200),
    ]),

    watchlist_symbols: new FormControl(false),
    all_symbols: new FormControl(false),
    symbols: new FormControl(''),
    ignore_symbols: new FormControl(
      'PEPEUSDT, BTCUSDT, ETHUSDT, XRPUSDT, LTCUSDT',
    ),
    volume_filter_interval: new FormControl('interval_24h'),
    volume_filter_from: new FormControl(0, [
      Validators.min(0),
      Validators.max(1_000_000_000),
    ]),
    volume_filter_to: new FormControl(100_000_000_000, [
      Validators.min(0),
      Validators.max(100_000_000_000),
    ]),
  });
};

export const alertFormDefaultValues = {
  volumeSplashInterval: 'interval_5m',
  interval: 'interval_24h',
  priceChangeDirection: 'all',
  fundingDirection: 'all',
};

export const getAlertTypeText = (
  alertType: AlertType,
  translateService: TranslateService,
): string => {
  switch (alertType) {
    case 'btcCorrelation':
      return translateService.instant('alerts.btcCorrelation');
    case 'priceChange':
      return translateService.instant('alerts.priceChange');
    case 'price':
      return translateService.instant('alerts.price');
    case 'limitOrder':
      return translateService.instant('alerts.limitOrder');
    case 'volatility':
      return translateService.instant('alerts.volatilityType');
    case 'listing':
      return translateService.instant('alerts.listing');
    case 'volumeSplash':
      return translateService.instant('alerts.volumeSplash');
    case 'funding':
      return translateService.instant('alerts.funding');
    default:
      return translateService.instant('alerts.default');
  }
};

export enum AlertTypeColors {
  btcCorrelation = '#6f2c31',
  priceChange = '#2a6d73',
  price = '#4c3e89',
  limitOrder = '#257246',
  volatility = '#273e71',
  listing = '#8f784b',
  volumeSplash = '#80408e',
}

export const getAlertColor = (alertType: AlertType) =>
  AlertTypeColors[alertType];
