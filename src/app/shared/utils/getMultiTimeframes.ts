import { Timeframe } from '../models/Timeframe';

export const getMultiTimeframes = (
  currentTimeframe: Timeframe,
): Timeframe[] => {
  const timeframes: Timeframe[] = ['5m', '15m', '1h', '4h', '1d'];

  const index = timeframes.indexOf(currentTimeframe);

  if (index !== -1) {
    if (timeframes[index + 1]) {
      return timeframes.slice(index + 1);
    } else {
      return [];
    }
  }

  return timeframes;
};
