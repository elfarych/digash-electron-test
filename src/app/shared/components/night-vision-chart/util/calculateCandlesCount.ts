import { Timeframe } from '../../../models/Timeframe';

export const calculateCandleCount = (
  startTimestamp: number,
  endTimestamp: number,
  timeframe: Timeframe,
): number => {
  const timeframesInMilliseconds = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
  };

  const timeframeInMilliseconds = timeframesInMilliseconds[timeframe];
  const duration = endTimestamp - startTimestamp;

  return Math.floor(duration / timeframeInMilliseconds);
};

export const calculateTimeRange = (
  candleCount: number,
  timeframe: Timeframe,
  endTimestamp: number = Date.now(),
): [number, number] => {
  const timeframesInMilliseconds = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
  };

  const timeframeInMilliseconds = timeframesInMilliseconds[timeframe];
  const duration = candleCount * timeframeInMilliseconds;
  const startTimestamp = endTimestamp - duration;

  return [startTimestamp, endTimestamp];
};
