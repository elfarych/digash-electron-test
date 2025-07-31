import {
  correlationIntervalsKeyMap,
  natrIntervalsKeyMap,
  priceChangeIntervalsKayMap,
  tradesIntervalsKeyMap,
  volatilityIntervalsKeyMap,
  volumeSumIntervalsKeyMap,
} from '../utils/intervalMaps';

export type SortingDirection = 'asc' | 'desc';

export type SortingType =
  | 'alphabetically'
  | 'volatility'
  | 'volume'
  | 'trades'
  | 'topGainers'
  | 'correlation'
  | 'topLosers'
  | 'watchlist'
  | 'volumeSplash'
  | 'alerts'
  | 'natr'
  | 'coin' // alerts
  | 'limitorders'
  | 'horizontalLevels'
  | 'trendLevels'
  | 'funding'
  | 'listing';

export type SortingTypeRange =
  | '1m'
  | '2m'
  | '3m'
  | '5m'
  | '10m'
  | '15m'
  | '20m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '12h'
  | '24h';

export type SortingTime = 'realtime' | '30s' | '1m' | '5m' | 'manual';

export const sortingDataKeyMap = {
  volatility: 'volatility_data',
  volume: 'volume_data',
  trades: 'trades_data',
  topGainers: 'price_changes',
  topLosers: 'price_changes',
  correlation: 'correlation_data',
  natr: 'natr',
  volumeSplash: ['volume_data']['volume_idx'],
};

export const sortingIntervalsKeyMap = {
  volatility: volatilityIntervalsKeyMap,
  volume: volumeSumIntervalsKeyMap,
  trades: tradesIntervalsKeyMap,
  topGainers: priceChangeIntervalsKayMap,
  topLosers: priceChangeIntervalsKayMap,
  correlation: correlationIntervalsKeyMap,
  natr: natrIntervalsKeyMap,
};
