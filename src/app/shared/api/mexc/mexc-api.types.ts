export type MexcSpotApiKline = [
  number, // windowStart
  string, // openingPrice
  string, // highestPrice
  string, // lowestPrice
  string, // closingPrice
  string, // volume
  number, // windowEnd
  string, // amount
];

export type MexcKlinesInterval =
  | 'Min1'
  | 'Min5'
  | 'Min15'
  | 'Min60'
  | 'Hour4'
  | 'Day1';

export const mexcIntervalsMap: { [interval: string]: MexcKlinesInterval } = {
  '1m': 'Min1',
  '5m': 'Min5',
  '15m': 'Min15',
  '1h': 'Min60',
  '4h': 'Hour4',
  '1d': 'Day1',
};

export interface MexcFuturesKlineApiData {
  time: number[];
  open: number[];
  close: number[];
  high: number[];
  low: number[];
  vol: number[];
  amount: number[];
  realOpen: number[];
  realClose: number[];
  realHigh: number[];
  realLow: number[];
}

export interface MexcFuturesKlineWebsocketData {
  symbol: string;
  interval: string;
  t: number;
  o: number;
  c: number;
  h: number;
  l: number;
  a: number;
  q: number;
  ro: number;
  rc: number;
  rh: number;
  rl: number;
}

export interface MexcWebsocketKline {
  windowStart: string;
  openingPrice: string;
  closingPrice: string;
  highestPrice: string;
  lowestPrice: string;
  volume: string;
  amount: string;
  windowEnd: string;
}

export interface MexcFuturesContractInfo {
  contractSize: number;
  symbol: string;
}
