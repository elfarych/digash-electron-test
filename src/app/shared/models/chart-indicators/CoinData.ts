import { ChartIndicatorPropFormControl } from './ChartIndicatorsProps';
import { CandlestickIntervals } from '../Candlestick';
import { TranslateService } from '@ngx-translate/core';

export const getTextColor = () => {
  // return document.body.classList.contains('light-theme') ? '#000' : '#ecd5d9';
  return document.body.classList.contains('light-theme') ? '#000' : '#adadad';
};

const getPositionOptions = (translateService: TranslateService) => [
  { value: translateService.instant('position.top-left'), key: 'top-left' },
  { value: translateService.instant('position.top-right'), key: 'top-right' },
  {
    value: translateService.instant('position.bottom-left'),
    key: 'bottom-left',
  },
  {
    value: translateService.instant('position.bottom-right'),
    key: 'bottom-right',
  },
];

const getLabelWithSuffix = (label: string, premium: boolean, translateService: TranslateService): string =>
  premium ? label : `${label} ${translateService.instant('sorting.premiumSuffix')}`;

const getRangeOptions = (translateService: TranslateService, premium: boolean) => [
  { value: getLabelWithSuffix(translateService.instant('range.15m'), premium, translateService), key: '15m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.30m'), premium, translateService), key: '30m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.1h'), premium, translateService), key: '1h', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.2h'), premium, translateService), key: '2h', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.6h'), premium, translateService), key: '6h', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.12h'), premium, translateService), key: '12h', isDisable: !premium },
  { value: translateService.instant('range.1d'), key: '1d' },
];

const getVolumeSplashRangeOptions = (translateService: TranslateService, premium: boolean) => [
  { value: getLabelWithSuffix(translateService.instant('volumeSplashRange.5m'), premium, translateService), key: '5m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('volumeSplashRange.10m'), premium, translateService), key: '10m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('volumeSplashRange.15m'), premium, translateService), key: '15m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('volumeSplashRange.20m'), premium, translateService), key: '20m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('volumeSplashRange.30m'), premium, translateService), key: '30m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.1h'), premium, translateService), key: '1h', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.2h'), premium, translateService), key: '2h', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.6h'), premium, translateService), key: '6h', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.12h'), premium, translateService), key: '12h', isDisable: !premium },
  { value: translateService.instant('range.1d'), key: '1d' },
];

const getNatrRangeOptions = (translateService: TranslateService, premium: boolean) => [
  { value: getLabelWithSuffix(translateService.instant('natrRange.2m'), premium, translateService), key: '2m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('natrRange.5m'), premium, translateService), key: '5m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('natrRange.10m'), premium, translateService), key: '10m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('natrRange.15m'), premium, translateService), key: '15m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('natrRange.20m'), premium, translateService), key: '20m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.30m'), premium, translateService), key: '30m', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.1h'), premium, translateService), key: '1h', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.2h'), premium, translateService), key: '2h', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.6h'), premium, translateService), key: '6h', isDisable: !premium },
  { value: getLabelWithSuffix(translateService.instant('range.12h'), premium, translateService), key: '12h', isDisable: !premium },
  { value: translateService.instant('range.1d'), key: '1d' },
];
export type VolumeSplashIntervals =
  | '5m'
  | '10m'
  | '15m'
  | '20m'
  | '30m'
  | '1h'
  | '2h'
  | '6h'
  | '12h'
  | '1d';
export type NatrIntervals =
  | '2m'
  | '5m'
  | '10m'
  | '15m'
  | '20m'
  | '30m'
  | '1h'
  | '2h'
  | '6h'
  | '12h'
  | '1d';

export type CoinDataPropKeys =
  | 'showVolume'
  | 'volumeRange'
  | 'showTrades'
  | 'tradesRange'
  | 'showCorrelation'
  | 'showVolatility'
  | 'showChange'
  | 'volatilityRange'
  | 'changeRange'
  | 'correlationRange'
  | 'showVolumeSplash'
  | 'volumeSplashRange'
  | 'showNatr'
  | 'natrRange'
  | 'position'
  | 'showFundingRate'
  | 'textColor';

export type CoinDataPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface CoinDataProps {
  showVolume: boolean;
  showTrades: boolean;
  showCorrelation: boolean;
  showVolatility: boolean;
  showNatr: boolean;
  showVolumeSplash: boolean;
  showChange: boolean;
  showFundingRate: boolean;
  textColor: string;
  volumeRange: CandlestickIntervals;
  changeRange: CandlestickIntervals;
  volatilityRange: CandlestickIntervals;
  tradesRange: CandlestickIntervals;
  correlationRange: CandlestickIntervals;
  volumeSplashRange: VolumeSplashIntervals;
  natrRange: NatrIntervals;
  position: CoinDataPosition;
}

export const defaultCoinDataProps: CoinDataProps = {
  showVolume: true,
  volumeRange: '1d',
  showTrades: true,
  tradesRange: '1d',
  showCorrelation: true,
  correlationRange: '1d',
  showVolatility: true,
  volatilityRange: '1d',
  showChange: true,
  showNatr: true,
  showFundingRate: true,
  showVolumeSplash: true,
  changeRange: '1d',
  volumeSplashRange: '1d',
  natrRange: '1d',
  position: 'top-left',
  textColor: getTextColor(),
};

export const chartIndicatorPeriodOptions = [
  { value: 'Последние 1 минуту', key: '1m' },
  { value: 'Последние 3 минуты', key: '3m' },
  { value: 'Последние 5 минут', key: '5m' },
  { value: 'Последние 15 минут', key: '15m' },
  { value: 'Последние 30 минут', key: '30m' },
  { value: 'Последний 1 час', key: '1h' },
  { value: 'Последние 2 часа', key: '2h' },
  { value: 'Последние 6 часов', key: '6h' },
  { value: 'Последние 12 часов', key: '12h' },
  { value: 'Последние 24 часа', key: '1d' },
];

export const CoinDataForm = (
  translateService: TranslateService,
  premium: boolean
): ChartIndicatorPropFormControl<CoinDataPropKeys>[] => [
  {
    key: 'showVolume',
    label: 'Объем',
    type: 'boolean',
    value: true,
  },
  {
    key: 'volumeRange',
    label: 'Период',
    type: 'dropdown',
    value: '1d',
    options: getRangeOptions(translateService, premium),
  },

  {
    key: 'showChange',
    label: 'Изменение цены',
    type: 'boolean',
    value: true,
  },
  {
    key: 'changeRange',
    label: 'Период',
    type: 'dropdown',
    value: '1d',
    options: getRangeOptions(translateService, premium),
  },

  {
    key: 'showVolatility',
    label: 'Волатильность',
    type: 'boolean',
    value: true,
  },
  {
    key: 'volatilityRange',
    label: 'Период',
    type: 'dropdown',
    value: '1d',
    options: getRangeOptions(translateService, premium),
  },

  {
    key: 'showTrades',
    label: 'Сделки',
    type: 'boolean',
    value: true,
  },
  {
    key: 'tradesRange',
    label: 'Период',
    type: 'dropdown',
    value: '1d',
    options: getRangeOptions(translateService, premium),
  },

  {
    key: 'showCorrelation',
    label: 'Корреляция с BTC',
    type: 'boolean',
    value: true,
  },
  {
    key: 'correlationRange',
    label: 'Период',
    type: 'dropdown',
    value: '1d',
    options: getRangeOptions(translateService, premium),
  },
  {
    key: 'showVolumeSplash',
    label: 'Всплески объема',
    type: 'boolean',
    value: true,
  },
  {
    key: 'volumeSplashRange',
    label: 'Период',
    type: 'dropdown',
    value: '1d',
    options: getVolumeSplashRangeOptions(translateService, premium),
  },

  {
    key: 'showNatr',
    label: 'NATR',
    type: 'boolean',
    value: true,
  },

  {
    key: 'natrRange',
    label: 'Период',
    type: 'dropdown',
    value: '1d',
    options: getNatrRangeOptions(translateService, premium),
  },

  {
    key: 'showFundingRate',
    label: 'Funding',
    type: 'boolean',
    value: true,
  },

  {
    key: 'position',
    label: 'Расположение',
    type: 'dropdown',
    value: 'top-left',
    options: getPositionOptions(translateService),
  },
];
