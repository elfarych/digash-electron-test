export type CandlestickBinance = [
  openTime: number,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  closeTime: number,
  assetVolume: string,
  trades: number,
  buyBaseVolume: string,
  buyQouteVolume: string,
  ignore: string,
];

export type CandlestickBybit = {
  time: number;
  result: {
    symbol: string;
    list: [
      startTime: string,
      openPrice: string,
      highPrice: string,
      lowPrice: string,
      closePrice: string,
      volume: string,
      turnover: string,
    ][];
  };
};

export type BitgetCandle = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type CandlestickBitget = {
  code: '00000';
  msg: 'success';
  requestTime: 1695865615662;
  data: [BitgetCandle];
};

export type CandlestickCommon = [
  openTime: number,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  closeTime: number,
  assetVolume: string,
  trades: number,
  buyBaseVolume: string,
  buyQouteVolume: string,
  ignore: string,
];

export interface CandlestickVisualization {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  newCandle: boolean;
  buyVolume: number;
  sellVolume: number;
  symbol?: string;
}

export type OkxCandle = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type CandlestickOkx = {
  code: string;
  msg: string;
  data: [OkxCandle];
};

export type CandlestickGateSpot = [
  string, // timestamp seconds
  string, // quote volume
  string, // Closing price
  string, // Highest price
  string, // Lowest price
  string, // Opening price
  string, // Trading volume in base currency
  boolean,
];

export interface CandlestickGateFutures {
  o: string;
  v: number; // volume
  t: number;
  c: string;
  l: string;
  h: string;
  sum: string; // quote volume
}

export type CandlestickIntervals =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '1w';
