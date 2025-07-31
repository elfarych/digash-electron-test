import { Timeframe } from '../models/Timeframe';
import { Exchange } from '../models/Exchange';

export const bitgetSpotIntervalsMap = {
  '1m': '1min',
  '5m': '5min',
  '15m': '15min',
  '30m': '30min',
  '1h': '1h',
  '4h': '4h',
  '6h': '6h',
  '12h': '12h',
  '24h': '1day',
  '1d': '1day',
};

export const bitgetFuturesIntervalsMap = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1H',
  '4h': '4H',
  '6h': '6H',
  '12h': '12H',
  '24h': '1D',
  '1d': '1D',
};

export const bitgetCandleStremIntervalsMap = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1H',
  '4h': '4H',
  '6h': '6H',
  '12h': '12H',
  '24h': '1D',
  '1d': '1D',
};

export const bitgetIntervalConverter = (
  interval: Timeframe,
  market: Exchange,
): string => {
  if (market === 'BITGET_SPOT' || market === 'BITGET_SPOT_WITHOUT_BINANCE')
    return bitgetSpotIntervalsMap[interval];
  if (
    market === 'BITGET_FUTURES' ||
    market === 'BITGET_FUTURES_WITHOUT_BINANCE'
  )
    return bitgetFuturesIntervalsMap[interval];
  return '';
};
