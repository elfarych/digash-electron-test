export type DropdownOptions<T> = { value: T; label: string }[];

export type DataLoaderMode = 'auto' | 'manual';

export type FilterIntervalType =
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

export type ChartSettingsType =
  | 'all'
  | 'horizontalLevels'
  | 'trendLevels'
  | 'densities'
  | 'filters';

export type PriceDirection = 'ALL' | 'UP' | 'DOWN';
