import { Timeframe } from '../models/Timeframe';

export const roundDate = (date: Date, interval: Timeframe = '1m'): Date => {
  let minutes = 1;
  if (interval.includes('m')) {
    minutes = parseInt(interval);
  }

  if (interval.includes('h')) {
    minutes = parseInt(interval) * 60;
  }

  if (interval.includes('d')) {
    minutes = parseInt(interval) * 24;
  }

  const ms = 1000 * 60 * minutes;
  return new Date(Math.floor(date.getTime() / ms) * ms);
};
