import { Exchange } from './Exchange';
import { Timeframe } from './Timeframe';
import { ChartTechnicalIndicators } from './chart-indicators/ChartIndicators';
import { FilterIntervalType } from '../types/base.types';

export type DensitiesWidgetSettingsSorting =
  | 'size'
  | 'distance'
  | 'corrosionTime';

export interface DensitiesWidgetSettings {
  width: number;
  height: number;
  left: number;
  bottom: number;
  opacity: number;
  collapsed?: boolean;
  sorting: DensitiesWidgetSettingsSorting;
}

export interface ChartSettings {
  market: Exchange;
  timeframe: Timeframe;
  chartGridTimeFrames?: { [key: string]: Timeframe };

  showDailyHighAndLow: boolean;

  showLimitOrders: boolean;
  limitOrderDistance: number;
  limitOrderLife: number;
  limitOrderCorrosionTime: number;
  limitOrderFilter: number;
  round_density: boolean;
  showLimitOrdersMarker: boolean;

  showTrendLevels: boolean;

  showHorizontalLevels: boolean;
  horizontalLevelsTouches: number;
  horizontalLevelsTouchesThreshold: number;
  horizontalLevelsPeriod: number;
  horizontalLevelsLivingTime: number;
  roundHorizontalLevels: boolean;
  horizontalLevelsTimeframes?: Timeframe[];

  trendlinesSource: 'high/low' | 'close';
  trendlinesPeriod: number;

  technicalIndicators: ChartTechnicalIndicators[];

  // Filters
  excludedExchanges?: Exchange[];
  volumeInterval?: FilterIntervalType;
  volumeFrom?: number;
  volumeTo?: number;
  correlationInterval?: FilterIntervalType;
  priceChangeInterval?: FilterIntervalType;
  correlationFrom?: number;
  correlationTo?: number;
  priceChangeFrom?: number;
  priceChangeTo?: number;
  showOnlyActiveCoins?: boolean;
  blacklist?: string[];
  candlesLength?: number;
  chartOffset?: number;

  tradesInterval?: FilterIntervalType;
  tradesFrom?: number;
  tradesTo?: number;

  showActiveCoinTooltips?: boolean;

  showDensitiesWidget?: boolean;
  densitiesWidgetSettings?: DensitiesWidgetSettings;
}

export const defaultChartSettings: ChartSettings = {
  showDailyHighAndLow: false,
  market: 'BINANCE_SPOT',
  timeframe: '5m',
  showLimitOrders: true,
  limitOrderFilter: 50_000,
  limitOrderDistance: 5,
  limitOrderLife: 0,
  limitOrderCorrosionTime: 0,
  round_density: false,
  showHorizontalLevels: true,
  horizontalLevelsTouches: 0,
  horizontalLevelsTouchesThreshold: 0.5,
  horizontalLevelsLivingTime: 0,
  horizontalLevelsPeriod: 20,
  showTrendLevels: true,
  technicalIndicators: [],
  trendlinesSource: 'high/low',
  trendlinesPeriod: 20,
  volumeFrom: 0,
  volumeTo: 100_000_000_000,
  correlationFrom: -100,
  correlationTo: 100,
  priceChangeFrom: 0,
  priceChangeTo: 0,
  priceChangeInterval: 'interval_24h',
  showOnlyActiveCoins: false,
  showLimitOrdersMarker: true,
  showActiveCoinTooltips: true,
  roundHorizontalLevels: false,
  showDensitiesWidget: true,
  tradesFrom: 0,
  tradesTo: 0,
  tradesInterval: 'interval_24h',
  excludedExchanges: [],
  densitiesWidgetSettings: {
    width: 330,
    height: 300,
    bottom: 16,
    left: 16,
    opacity: 1,
    collapsed: false,
    sorting: 'distance',
  },
};
