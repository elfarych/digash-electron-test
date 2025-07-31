import { LimitOrderData } from '../../../shared/models/LimitOrderData';
import { Exchange } from '../../../shared/models/Exchange';
import { CoinData } from '../../../shared/models/CoinData';
import { Timeframe } from '../../../shared/models/Timeframe';

export type DepthDataLoaderMode = 'auto' | 'manual';

export type DepthMapFilterPeriod =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '6h'
  | '12h'
  | '24h';

export interface LimitOrderDepthMapData extends LimitOrderData {
  symbol: string;
  exchange: Exchange;
}

export interface DepthMapData {
  asks: DepthMapDataOrderBlock;
  bids: DepthMapDataOrderBlock;
}

export interface DepthMapOrderGroup {
  small: LimitOrderDepthMapData[];
  medium: LimitOrderDepthMapData[];
  large: LimitOrderDepthMapData[];
}

export interface DepthMapDataOrderBlock {
  distantBlock: DepthMapOrderGroup;
  nearBlock: DepthMapOrderGroup;
}

export interface DepthMapCoinsData {
  [symbol: string]: {
    [exchange: string]: CoinData;
  };
}

export interface DepthMapOrderFilterValues {
  minCorrosionTime: number;
  minOrderSum: number;
  filterByOrderSum: boolean;
}

export interface DepthMapExchangeSettings {
  active: boolean;
  smallOrderFilterValues: DepthMapOrderFilterValues;
  mediumOrderFilterValues: DepthMapOrderFilterValues;
  largeOrderFilterValues: DepthMapOrderFilterValues;
  volumeFilterIsActive: boolean;
  volumeFromFilter: number;
  volumeToFilter: number;
  volumeFilterPeriod: DepthMapFilterPeriod;
  priceChangeFilterIsActive: boolean;
  priceChangeFromFilter: number;
  priceChangeToFilter: number;
  priceChangeFilterPeriod: DepthMapFilterPeriod;
}

export interface DepthMapSettings {
  askOrdersColor: string;
  bidOrdersColor: string;
  blacklist: string[];
  loaderMode: DepthDataLoaderMode;
  chartTimeframe: Timeframe;
  loaderIntervalSec?: number;
  maxOrdersInColumn: number;

  showExchange: boolean;
  showDistance: boolean;
  showCorrosionTime: boolean;
  showOrderSum: boolean;

  exchangesSettings: {
    [exchange: string]: DepthMapExchangeSettings;
  };
}

export interface DepthMapSettingsApiResponse {
  user: number;
  settings: DepthMapSettings;
}

export const getEmptyDepthMapData = (): DepthMapData => {
  return {
    asks: getEmptyDepthMapDataBlocks(),
    bids: getEmptyDepthMapDataBlocks(),
  };
};

export const getEmptyDepthMapDataBlocks = (): DepthMapDataOrderBlock => {
  return {
    distantBlock: { small: [], medium: [], large: [] },
    nearBlock: { small: [], medium: [], large: [] },
  };
};
