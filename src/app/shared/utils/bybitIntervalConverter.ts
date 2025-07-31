import { Timeframe } from '../models/Timeframe';

export const bybitIntervalConverter = (interval: Timeframe): string => {
  if (interval.includes('m')) {
    return parseInt(interval).toString();
  }

  if (interval.includes('h')) {
    return (parseInt(interval) * 60).toString();
  }

  if (interval.includes('d')) {
    return 'D';
  }

  return '1';
};
