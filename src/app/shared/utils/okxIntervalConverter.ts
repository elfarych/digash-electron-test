import {CandlestickIntervals} from "../models/Candlestick";

export const okxIntervalsMap = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1H',
  '2h': '2H',
  '4h': '4H',
  '6h': '6H',
  '12h': '12H',
  '24h': '1D',
  '1d': '1D',
}

export const okxIntervalConverter = (interval: CandlestickIntervals): number | string => {
  return okxIntervalsMap[interval]
}
