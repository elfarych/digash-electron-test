import { CoinData } from '../../../shared/models/CoinData';
import { LimitOrderData } from '../../../shared/models/LimitOrderData';
import { Exchange } from '../../../shared/models/Exchange';
import { Timeframe } from '../../../shared/models/Timeframe';

export type OrderbookMapDataLoaderMode = 'auto' | 'manual';
export type OrderbookBigOrderUnit = 'sum' | 'corrosion_time';
export type OrderBookMapOrdersDirection = 'buy' | 'sell' | 'all';
export type OrderbookMapFilterPeriod =
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

export interface OrderbookMapLimitOrderData extends LimitOrderData {
  symbol: string;
  exchange: Exchange;
  sizeInPercent: number;
  densitiesPerCoin: number;
}

export interface OrderbookMapCoinsData {
  [symbol: string]: {
    [exchange: string]: CoinData;
  };
}

export interface OrderbookMapData {
  asks: OrderbookMapLimitOrderData[];
  bids: OrderbookMapLimitOrderData[];
}

export type SingleDensityPerCoinType = 'distance' | 'corrosion_time';

export interface OrderbookMapExchangeSettings {
  active: boolean;
  ordersMinCorrosionTime: number;
  ordersBigCorrosionTime: number;
  ordersMinSum: number;
  limitOrderLife: number;
  round_density: boolean;
  singleDensityPerCoin: boolean;
  singleDensityPerCoinType: SingleDensityPerCoinType;

  volumeFilterIsActive: boolean;
  volumeFromFilter: number;
  volumeToFilter: number;
  volumeFilterPeriod: OrderbookMapFilterPeriod;
  priceChangeFilterIsActive: boolean;
  priceChangeFromFilter: number;
  priceChangeToFilter: number;
  priceChangeFilterPeriod: OrderbookMapFilterPeriod;
}

export interface OrderbookMapSettings {
  askOrdersColor: string;
  bidOrdersColor: string;
  blacklist: string[];
  loaderMode: OrderbookMapDataLoaderMode;
  chartTimeframe: Timeframe;
  loaderIntervalSec?: number;

  showExchange: boolean;
  showDistance: boolean;
  showCorrosionTime: boolean;
  showOrderSum: boolean;
  openChartOnHover: boolean;
  maxOrdersToShow: number;
  maxOrdersDistance: number;
  ordersDirection: OrderBookMapOrdersDirection;
  chartCandlesLength: number;

  displayLargeCirce: boolean;
  largeCircleDistance: number;
  displaySmallCircle: boolean;
  smallCircleDistance: number;

  exchangesSettings: {
    [exchange: string]: OrderbookMapExchangeSettings;
  };
}

export interface OrderbookMapSettingsApiResponse {
  user: number;
  settings: OrderbookMapSettings;
}

export const getEmptyOrderbookMapData = (): OrderbookMapData => {
  return {
    asks: [],
    bids: [],
  };
};
