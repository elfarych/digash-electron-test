import { CoinsNavigationStateSettings } from '../store/coins-navigation/coins-navigation.reducer';
import { ChartSettings } from './ChartSettings';
import { CoinData } from './CoinData';
import { Watchlist } from './Watchlist';

export interface CoinsNavigationData {
  settings: CoinsNavigationStateSettings;
  chartSettings: ChartSettings;
  data: { [key: string]: CoinData };
  sorting: string;
  watchlist: Watchlist;
}

export interface CoinsNavigationRawData {
  [key: string]: CoinData;
}
