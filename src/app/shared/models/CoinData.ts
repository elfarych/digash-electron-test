import { LimitOrderData } from './LimitOrderData';
import { ChartHorizontalLevels, ChartLevelData } from './ChartHorizontalLevels';
import { Exchange } from './Exchange';
import { Timeframe } from './Timeframe';

export interface HorizontalLevels {
  top_levels: ChartLevelData[];
  bottom_levels: ChartLevelData[];
}

export type TrendLevel = [number, number];

export interface CoinActivityData {
  is_active: boolean;
  price_change_activity: boolean;
  top_5_price_change_down: boolean;
  top_5_price_change_up: boolean;
  top_5_trades: boolean;
  top_5_volatility: boolean;
  volume_activity: boolean;
}

export interface CoinImpulseFormationsData {
  impulse_count_gt_5_percent_gt_1_period_10h: boolean;
  impulse_count_gt_5_percent_gt_3_period_24h: boolean;
}

export interface CoinFormationsData {
  impulse_formations: CoinImpulseFormationsData;
}

export interface HighLowData {
  high: { value: number; timestamp: number };
  low: { value: number; timestamp: number };
}

export interface Funding {
  fundingRate: number;
  nextFundingTime: number;
  timestamp: number;
}

export type CoinDataHorizontalLevelData = [number, number, { touches: number }];

export interface CoinDataHorizontalLevels {
  '1m': CoinDataHorizontalLevelData[];
  '5m': CoinDataHorizontalLevelData[];
  '15m': CoinDataHorizontalLevelData[];
  '1h': CoinDataHorizontalLevelData[];
  '4h': CoinDataHorizontalLevelData[];
  '24h': CoinDataHorizontalLevelData[];
  distance_1d: number;
  distance_1h: number;
  distance_1m: number;
  distance_4h: number;
  distance_5m: number;
  distance_15m: number;
  distance_24h: number;
}

export interface CoinData {
  symbol: string;
  current_price: number;
  is_swappable: boolean;
  market: Exchange;
  market_to_swap: Exchange;
  activity: CoinActivityData;
  formations: CoinFormationsData;
  correlation_data: {
    correlationIdx5m: number;
    correlationIdx15m: number;
    correlationIdx30m: number;
    correlationIdx1h: number;
    correlationIdx2h: number;
    correlationIdx6h: number;
    correlationIdx12h: number;
    correlationIdx24h: number;
  };
  price_changes: {
    priceChange5m: number;
    priceChange15m: number;
    priceChange30m: number;
    priceChange1h: number;
    priceChange2h: number;
    priceChange6h: number;
    priceChange12h: number;
    priceChange24h: number;
  };
  volume_data: {
    volume_avg_5m: number;
    volume_avg_15m: number;
    volume_avg_30m: number;
    volume_avg_1h: number;
    volume_avg_2h: number;
    volume_avg_6h: number;
    volume_avg_12h: number;
    volume_avg_24h: number;

    volume_sum_5m: number;
    volume_sum_15m: number;
    volume_sum_30m: number;
    volume_sum_1h: number;
    volume_sum_2h: number;
    volume_sum_6h: number;
    volume_sum_12h: number;
    volume_sum_24h: number;

    volume_idx: {
      volumeIdx30m: number;
      volumeIdx1h: number;
      volumeIdx2h: number;
      volumeIdx6h: number;
      volumeIdx12h: number;
      volumeIdx24h: number;
      volumeIdx2h_5m: number;
      volumeIdx2h_10m: number;
      volumeIdx2h_15m: number;
      volumeIdx2h_20m: number;
      volumeIdx2h_30m: number;
      volumeIdx2h_1h: number;
      volumeIdx24h_2h: number;
      volumeIdx24h_6h: number;
      volumeIdx24h_12h: number;
      volumeIdx7d_24h: number;
    };
  };
  trades_data: {
    trades_sum_5m: number;
    trades_sum_15m: number;
    trades_sum_30m: number;
    trades_sum_1h: number;
    trades_sum_2h: number;
    trades_sum_6h: number;
    trades_sum_12h: number;
    trades_sum_24h: number;
  };
  volatility_data: {
    volatilityIdx5m: number;
    volatilityIdx15m: number;
    volatilityIdx30m: number;
    volatilityIdx1h: number;
    volatilityIdx2h: number;
    volatilityIdx6h: number;
    volatilityIdx12h: number;
    volatilityIdx24h: number;
  };
  natr: {
    natr2m: number | null;
    natr5m: number | null;
    natr10m: number | null;
    natr15m: number | null;
    natr20m: number | null;
    natr30m: number | null;
    natr1h: number | null;
    natr2h: number | null;
    natr4h: number | null;
    natr6h: number | null;
    natr12h: number | null;
    natr24h: number | null;
  };
  high_lows: ChartHorizontalLevels;
  horizontal_levels: CoinDataHorizontalLevels;
  a: LimitOrderData[];
  b: LimitOrderData[];
  formation: boolean;
  daily_high_lows: HighLowData;
  is_active: boolean;
  use_backend_levels?: boolean;
  use_backend_trend_levels?: boolean;
  nearest_level_distance?: number;
  trend_levels?: { [key in Timeframe]: TrendLevel[] };
  funding?: Funding;
  listing?: string;
}
