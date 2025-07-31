import { TranslateService } from '@ngx-translate/core';
import { SortingType, SortingTypeRange } from './Sorting';

export type SortingId =
  | 'CH1m'
  | 'CH3m'
  | 'CH5m'
  | 'CH15m'
  | 'CH30m'
  | 'CH1h'
  | 'CH2h'
  | 'CH6h'
  | 'CH12h'
  | 'CH24h'
  | 'VOL1m'
  | 'VOL3m'
  | 'VOL5m'
  | 'VOL15m'
  | 'VOL30m'
  | 'VOL1h'
  | 'VOL2h'
  | 'VOL6h'
  | 'VOL12h'
  | 'VOL24h'
  | 'COR3m'
  | 'COR5m'
  | 'COR15m'
  | 'COR30m'
  | 'COR1h'
  | 'COR2h'
  | 'COR6h'
  | 'COR12h'
  | 'COR24h'
  | 'VAvg1m'
  | 'VAvg3m'
  | 'VAvg5m'
  | 'VAvg15m'
  | 'VAvg30m'
  | 'VAvg1h'
  | 'VAvg2h'
  | 'VAvg6h'
  | 'V1m'
  | 'V3m'
  | 'V5m'
  | 'V15m'
  | 'V30m'
  | 'V1h'
  | 'V2h'
  | 'V6h'
  | 'V12h'
  | 'V24h'
  | 'VS1m'
  | 'VS3m'
  | 'VS5m'
  | 'VS15m'
  | 'VS30m'
  | 'VS1h'
  | 'VS2h'
  | 'VS6h'
  | 'VS12h'
  | 'VS24h'
  | 'T1m'
  | 'T3m'
  | 'T5m'
  | 'T15m'
  | 'T30m'
  | 'T1h'
  | 'T2h'
  | 'T6h'
  | 'T12h'
  | 'T24h'
  | 'Watchlist'
  | 'Coin'
  | 'Alert'
  | 'LimitOrders'
  | 'HL1m'
  | 'HL5m'
  | 'HL15m'
  | 'HL1h'
  | 'HL4h'
  | 'HL24h'
  | 'TL1m'
  | 'TL5m'
  | 'TL15m'
  | 'TL1h'
  | 'TL4h'
  | 'TL24h'
  | 'Funding'
  | 'Listing';

export type CoinSortingType = {
  id: SortingId;
  label: string;
  shortLabel?: string;
  sorting: SortingType;
  trendSubType: SortingTypeRange;
  isDisabled?: boolean;
};

export const otherSorting = (
  translateService: TranslateService,
): CoinSortingType[] => [
  {
    id: 'Alert',
    label: translateService?.instant('sorting.alerts'),
    sorting: 'alerts',
    trendSubType: '1m',
  },
  {
    id: 'Watchlist',
    label: translateService?.instant('sorting.watchlist'),
    sorting: 'watchlist',
    trendSubType: '1m',
  },
  {
    id: 'LimitOrders',
    label: translateService?.instant(
      'navigation_settings.show_limit_orders_marker',
    ),
    sorting: 'limitorders',
    trendSubType: '1m',
  },
  {
    id: 'Funding',
    label: translateService?.instant('sorting.funding'),
    sorting: 'funding',
    trendSubType: '1m',
  },
  {
    id: 'Listing',
    label: translateService?.instant('sorting.listing'),
    sorting: 'listing',
    trendSubType: '1m',
  },
];

export const volumeSorting = (
  translateService: TranslateService,
): CoinSortingType[] => [
  {
    id: 'V1m',
    label: translateService?.instant('sorting.volume1m'),
    sorting: 'volume',
    trendSubType: '1m',
  },
  {
    id: 'V3m',
    label: translateService?.instant('sorting.volume3m'),
    sorting: 'volume',
    trendSubType: '3m',
  },
  {
    id: 'V5m',
    label: translateService?.instant('sorting.volume5m'),
    sorting: 'volume',
    trendSubType: '5m',
  },
  {
    id: 'V15m',
    label: translateService?.instant('sorting.volume15m'),
    sorting: 'volume',
    trendSubType: '15m',
  },
  {
    id: 'V30m',
    label: translateService?.instant('sorting.volume30m'),
    sorting: 'volume',
    trendSubType: '30m',
  },
  {
    id: 'V1h',
    label: translateService?.instant('sorting.volume1h'),
    sorting: 'volume',
    trendSubType: '1h',
  },
  {
    id: 'V2h',
    label: translateService?.instant('sorting.volume2h'),
    sorting: 'volume',
    trendSubType: '2h',
  },
  {
    id: 'V6h',
    label: translateService?.instant('sorting.volume6h'),
    sorting: 'volume',
    trendSubType: '6h',
  },
  {
    id: 'V12h',
    label: translateService?.instant('sorting.volume12h'),
    sorting: 'volume',
    trendSubType: '12h',
  },
  {
    id: 'V24h',
    label: translateService?.instant('sorting.volume24h'),
    sorting: 'volume',
    trendSubType: '24h',
  },
];

export const volumeSplashSorting = (
  translateService: TranslateService,
): CoinSortingType[] => [
  {
    id: 'VS5m',
    label: translateService?.instant('sorting.volumeSplash5m'),
    sorting: 'volumeSplash',
    trendSubType: '5m',
  },
  {
    id: 'VS15m',
    label: translateService?.instant('sorting.volumeSplash15m'),
    sorting: 'volumeSplash',
    trendSubType: '15m',
  },
  {
    id: 'VS30m',
    label: translateService?.instant('sorting.volumeSplash30m'),
    sorting: 'volumeSplash',
    trendSubType: '30m',
  },
  {
    id: 'VS1h',
    label: translateService?.instant('sorting.volumeSplash1h'),
    sorting: 'volumeSplash',
    trendSubType: '1h',
  },
  {
    id: 'VS2h',
    label: translateService?.instant('sorting.volumeSplash2h'),
    sorting: 'volumeSplash',
    trendSubType: '2h',
  },
  {
    id: 'VS6h',
    label: translateService?.instant('sorting.volumeSplash6h'),
    sorting: 'volumeSplash',
    trendSubType: '6h',
  },
  {
    id: 'VS12h',
    label: translateService?.instant('sorting.volumeSplash12h'),
    sorting: 'volumeSplash',
    trendSubType: '12h',
  },
  {
    id: 'VS24h',
    label: translateService?.instant('sorting.volumeSplash24h'),
    sorting: 'volumeSplash',
    trendSubType: '24h',
  },
];

export const priceChangeSorting = (
  translateService: TranslateService,
): CoinSortingType[] => [
  {
    id: 'CH1m',
    label: translateService?.instant('sorting.price1m'),
    sorting: 'topGainers',
    trendSubType: '1m',
  },
  {
    id: 'CH3m',
    label: translateService?.instant('sorting.price3m'),
    sorting: 'topGainers',
    trendSubType: '3m',
  },
  {
    id: 'CH5m',
    label: translateService?.instant('sorting.price5m'),
    sorting: 'topGainers',
    trendSubType: '5m',
  },
  {
    id: 'CH15m',
    label: translateService?.instant('sorting.price15m'),
    sorting: 'topGainers',
    trendSubType: '15m',
  },
  {
    id: 'CH30m',
    label: translateService?.instant('sorting.price30m'),
    sorting: 'topGainers',
    trendSubType: '30m',
  },
  {
    id: 'CH1h',
    label: translateService?.instant('sorting.price1h'),
    sorting: 'topGainers',
    trendSubType: '1h',
  },
  {
    id: 'CH2h',
    label: translateService?.instant('sorting.price2h'),
    sorting: 'topGainers',
    trendSubType: '2h',
  },
  {
    id: 'CH6h',
    label: translateService?.instant('sorting.price6h'),
    sorting: 'topGainers',
    trendSubType: '6h',
  },
  {
    id: 'CH12h',
    label: translateService?.instant('sorting.price12h'),
    sorting: 'topGainers',
    trendSubType: '12h',
  },
  {
    id: 'CH24h',
    label: translateService?.instant('sorting.price24h'),
    sorting: 'topGainers',
    trendSubType: '24h',
  },
];

export const correlationSorting = (
  translateService: TranslateService,
): CoinSortingType[] => [
  {
    id: 'COR15m',
    label: translateService?.instant('sorting.correlation15m'),
    shortLabel: translateService?.instant('sorting.corr15m'),
    sorting: 'correlation',
    trendSubType: '15m',
  },
  {
    id: 'COR30m',
    label: translateService?.instant('sorting.correlation30m'),
    shortLabel: translateService?.instant('sorting.corr30m'),
    sorting: 'correlation',
    trendSubType: '30m',
  },
  {
    id: 'COR1h',
    label: translateService?.instant('sorting.correlation1h'),
    shortLabel: translateService?.instant('sorting.corr1h'),
    sorting: 'correlation',
    trendSubType: '1h',
  },
  {
    id: 'COR2h',
    label: translateService?.instant('sorting.correlation2h'),
    shortLabel: translateService?.instant('sorting.corr2h'),
    sorting: 'correlation',
    trendSubType: '2h',
  },
  {
    id: 'COR6h',
    label: translateService?.instant('sorting.correlation6h'),
    shortLabel: translateService?.instant('sorting.corr6h'),
    sorting: 'correlation',
    trendSubType: '6h',
  },
  {
    id: 'COR12h',
    label: translateService?.instant('sorting.correlation12h'),
    shortLabel: translateService?.instant('sorting.corr12h'),
    sorting: 'correlation',
    trendSubType: '12h',
  },
  {
    id: 'COR24h',
    label: translateService?.instant('sorting.correlation24h'),
    shortLabel: translateService?.instant('sorting.corr24h'),
    sorting: 'correlation',
    trendSubType: '24h',
  },
];

export const volatilitySorting = (
  translateService: TranslateService,
): CoinSortingType[] => [
  {
    id: 'VOL1m',
    label: translateService?.instant('sorting.volatility1m'),
    shortLabel: translateService?.instant('sorting.vol1m'),
    sorting: 'volatility',
    trendSubType: '1m',
  },
  {
    id: 'VOL3m',
    label: translateService?.instant('sorting.volatility3m'),
    shortLabel: translateService?.instant('sorting.vol3m'),
    sorting: 'volatility',
    trendSubType: '3m',
  },
  {
    id: 'VOL5m',
    label: translateService?.instant('sorting.volatility5m'),
    shortLabel: translateService?.instant('sorting.vol5m'),
    sorting: 'volatility',
    trendSubType: '5m',
  },
  {
    id: 'VOL15m',
    label: translateService?.instant('sorting.volatility15m'),
    shortLabel: translateService?.instant('sorting.vol15m'),
    sorting: 'volatility',
    trendSubType: '15m',
  },
  {
    id: 'VOL30m',
    label: translateService?.instant('sorting.volatility30m'),
    shortLabel: translateService?.instant('sorting.vol30m'),
    sorting: 'volatility',
    trendSubType: '30m',
  },
  {
    id: 'VOL1h',
    label: translateService?.instant('sorting.volatility1h'),
    shortLabel: translateService?.instant('sorting.vol1h'),
    sorting: 'volatility',
    trendSubType: '1h',
  },
  {
    id: 'VOL2h',
    label: translateService?.instant('sorting.volatility2h'),
    shortLabel: translateService?.instant('sorting.vol2h'),
    sorting: 'volatility',
    trendSubType: '2h',
  },
  {
    id: 'VOL6h',
    label: translateService?.instant('sorting.volatility6h'),
    shortLabel: translateService?.instant('sorting.vol6h'),
    sorting: 'volatility',
    trendSubType: '6h',
  },
  {
    id: 'VOL12h',
    label: translateService?.instant('sorting.volatility12h'),
    shortLabel: translateService?.instant('sorting.vol12h'),
    sorting: 'volatility',
    trendSubType: '12h',
  },
  {
    id: 'VOL24h',
    label: translateService?.instant('sorting.volatility24h'),
    shortLabel: translateService?.instant('sorting.vol24h'),
    sorting: 'volatility',
    trendSubType: '24h',
  },
];

export const tradesSorting = (
  translateService: TranslateService,
): CoinSortingType[] => [
  {
    id: 'T1m',
    label: translateService?.instant('sorting.trades1m'),
    sorting: 'trades',
    trendSubType: '1m',
  },
  {
    id: 'T3m',
    label: translateService?.instant('sorting.trades3m'),
    sorting: 'trades',
    trendSubType: '3m',
  },
  {
    id: 'T5m',
    label: translateService?.instant('sorting.trades5m'),
    sorting: 'trades',
    trendSubType: '5m',
  },
  {
    id: 'T15m',
    label: translateService?.instant('sorting.trades15m'),
    sorting: 'trades',
    trendSubType: '15m',
  },
  {
    id: 'T30m',
    label: translateService?.instant('sorting.trades30m'),
    sorting: 'trades',
    trendSubType: '30m',
  },
  {
    id: 'T1h',
    label: translateService?.instant('sorting.trades1h'),
    sorting: 'trades',
    trendSubType: '1h',
  },
  {
    id: 'T2h',
    label: translateService?.instant('sorting.trades2h'),
    sorting: 'trades',
    trendSubType: '2h',
  },
  {
    id: 'T6h',
    label: translateService?.instant('sorting.trades6h'),
    sorting: 'trades',
    trendSubType: '6h',
  },
  {
    id: 'T12h',
    label: translateService?.instant('sorting.trades12h'),
    sorting: 'trades',
    trendSubType: '12h',
  },
  {
    id: 'T24h',
    label: translateService?.instant('sorting.trades24h'),
    sorting: 'trades',
    trendSubType: '24h',
  },
];

export const horizontalLevelsSorting = (
  translateService: TranslateService,
): CoinSortingType[] => [
  {
    id: 'HL1m',
    label: translateService?.instant('sorting.horizontalLevels1m'),
    sorting: 'horizontalLevels',
    trendSubType: '1m',
  },
  {
    id: 'HL5m',
    label: translateService?.instant('sorting.horizontalLevels5m'),
    sorting: 'horizontalLevels',
    trendSubType: '5m',
  },
  {
    id: 'HL15m',
    label: translateService?.instant('sorting.horizontalLevels15m'),
    sorting: 'horizontalLevels',
    trendSubType: '15m',
  },
  {
    id: 'HL1h',
    label: translateService?.instant('sorting.horizontalLevels1h'),
    sorting: 'horizontalLevels',
    trendSubType: '1h',
  },
  {
    id: 'HL4h',
    label: translateService?.instant('sorting.horizontalLevels4h'),
    sorting: 'horizontalLevels',
    trendSubType: '4h',
  },
  {
    id: 'HL24h',
    label: translateService?.instant('sorting.horizontalLevels24h'),
    sorting: 'horizontalLevels',
    trendSubType: '24h',
  },
];

export const trendLevelsSorting = (
  translateService: TranslateService,
): CoinSortingType[] => [
  {
    id: 'TL1m',
    label: translateService?.instant('sorting.trendLevels1m'),
    sorting: 'trendLevels',
    trendSubType: '1m',
  },
  {
    id: 'TL5m',
    label: translateService?.instant('sorting.trendLevels5m'),
    sorting: 'trendLevels',
    trendSubType: '5m',
  },
  {
    id: 'TL15m',
    label: translateService?.instant('sorting.trendLevels15m'),
    sorting: 'trendLevels',
    trendSubType: '15m',
  },
  {
    id: 'TL1h',
    label: translateService?.instant('sorting.trendLevels1h'),
    sorting: 'trendLevels',
    trendSubType: '1h',
  },
  {
    id: 'TL4h',
    label: translateService?.instant('sorting.trendLevels4h'),
    sorting: 'trendLevels',
    trendSubType: '4h',
  },
  {
    id: 'TL24h',
    label: translateService?.instant('sorting.trendLevels24h'),
    sorting: 'trendLevels',
    trendSubType: '24h',
  },
];

export const allSortingColumns = (
  translateService?: TranslateService,
): CoinSortingType[] => [
  ...otherSorting(translateService),
  ...volumeSorting(translateService),
  ...priceChangeSorting(translateService),
  ...correlationSorting(translateService),
  ...volatilitySorting(translateService),
  ...tradesSorting(translateService),
  ...horizontalLevelsSorting(translateService),
  ...trendLevelsSorting(translateService),
  ...volumeSplashSorting(translateService),
  {
    id: 'Coin',
    label: translateService?.instant('sorting.coin'),
    sorting: 'alphabetically',
    trendSubType: '5m',
  },
];
