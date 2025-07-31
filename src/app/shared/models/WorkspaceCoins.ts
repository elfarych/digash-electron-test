import { CoinData } from './CoinData';

export interface WorkspaceCoins {
  symbol: string;
  hasAlert?: boolean;
  data: CoinData;
}

export interface MultipleWorkSpaceCoins {
  [key: string]: WorkspaceCoins[]; // key - workspace id
}
