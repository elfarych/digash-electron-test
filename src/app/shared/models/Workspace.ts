import { CoinData } from './CoinData';
import { FormationFilterIntervalType, Formations } from './Formations';
import { SortingTime, SortingType, SortingTypeRange } from './Sorting';
import { LimitOrderLocation } from './formations/LimitOrderLocation';
import { ChartSettings } from './ChartSettings';
import { PriceDirection } from '../types/base.types';
import { Watchlist } from './Watchlist';
import { Exchange } from './Exchange';

export interface Workspace extends ChartSettings {
  id: number;
  title: string;

  volumeFrom: number;
  volumeTo: number;
  volumeInterval: FormationFilterIntervalType;
  priceChangeFrom: number;
  priceChangeTo: number;
  priceChangeInterval: FormationFilterIntervalType;
  correlationFrom: number;
  correlationTo: number;
  correlationInterval: FormationFilterIntervalType;

  candlesLength: number;

  formation: Formations;
  formationLimitOrderLevelDistance: number;
  formationLimitOrderLevelLocation: LimitOrderLocation;
  formationLevelTouchesThreshold: number;
  formationLevelTouches: number;
  workspaceSortIndex: number | null;
  showDailyHighAndLow: boolean;
  sortingType: SortingType;
  sortingTypeRange: SortingTypeRange;
  sortingTime: SortingTime;
  showOnlyFormations: boolean;
  sortByFormations: boolean;
  showOnlyWatchlistCoins: boolean;
  showOnlyCoinsWithAlerts: boolean;
  sortByAlerts: boolean;
  filterVolumeSplash: boolean;
  filterVolumeSplashValue: number;
  filterVolumeSplashPriceChange: boolean;
  filterVolumeSplashPriceChangeValue: number;
  filterVolumeSplashDirection: PriceDirection;
  filterNatr: boolean;
  filterNatrValue: number;

  excluded_markets: Exchange[];
}

export const getEmptyWorkspace = (): Workspace => ({
  id: undefined,
  title: undefined,
  sortingTypeRange: '5m',
  sortingType: 'alphabetically',
  market: 'BINANCE_SPOT',

  volumeFrom: 100_000,
  volumeTo: 100_000_000_000,
  volumeInterval: 'interval_24h',
  correlationFrom: -100,
  correlationTo: 100,
  correlationInterval: 'interval_24h',

  priceChangeFrom: null,
  priceChangeTo: null,
  priceChangeInterval: 'interval_24h',

  candlesLength: 400,

  timeframe: '5m',
  formation: 'None',
  showDailyHighAndLow: true,
  showLimitOrders: true,
  round_density: false,
  limitOrderFilter: 50_000,
  limitOrderDistance: 5,
  limitOrderLife: 0,
  limitOrderCorrosionTime: 0,
  showHorizontalLevels: true,
  horizontalLevelsTouches: 0,
  formationLimitOrderLevelDistance: 0.5,
  formationLimitOrderLevelLocation: 'none',
  formationLevelTouches: 0,
  formationLevelTouchesThreshold: 0.5,
  horizontalLevelsTouchesThreshold: 0.5,
  horizontalLevelsPeriod: 20,
  horizontalLevelsLivingTime: 0,
  showTrendLevels: true,
  trendlinesSource: 'high/low',
  trendlinesPeriod: 20,
  sortingTime: 'manual',
  technicalIndicators: [],
  showOnlyFormations: false,
  sortByFormations: false,
  showOnlyWatchlistCoins: false,
  workspaceSortIndex: null,
  sortByAlerts: false,
  showOnlyCoinsWithAlerts: false,
  filterVolumeSplash: false,
  filterVolumeSplashValue: 2,
  filterVolumeSplashPriceChange: false,
  filterVolumeSplashPriceChangeValue: 0,
  filterVolumeSplashDirection: 'ALL',
  filterNatr: false,
  filterNatrValue: 0.1,
  showLimitOrdersMarker: true,
  roundHorizontalLevels: true,
  excluded_markets: [],
});

export type WorkspaceApiData = {
  [key: string]: {
    // key is workspace id
    workspace: Workspace;
    data: { [key: string]: CoinData };
    sorting: string;
    watchlist: Watchlist;
  };
};
