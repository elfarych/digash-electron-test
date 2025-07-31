import { Timeframe } from '../models/Timeframe';

export const timeframeToSeconds = (timeframe: Timeframe): number => {
  if (timeframe.includes('m')) {
    return parseInt(timeframe) * 60;
  }

  if (timeframe.includes('h')) {
    return parseInt(timeframe) * 3600;
  }

  if (timeframe.includes('d')) {
    return parseInt(timeframe) * 3600 * 24;
  }

  return 60;
};
