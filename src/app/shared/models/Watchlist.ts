import { Exchange } from './Exchange';

export type WatchlistColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'sky'
  | 'pink'
  | 'clear';

export const watchlistColors: WatchlistColor[] = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'sky',
  'pink',
  'clear',
];

export interface WatchlistCoin {
  symbol: string;
  color: WatchlistColor;
}

export type Watchlist = {
  [exchange in Exchange]?: WatchlistCoin[];
};
