import { SortingTime } from '../models/Sorting';

export const sortingTimeToMs = (sortingTime: SortingTime): number => {
  switch (sortingTime) {
    case 'realtime':
      return 20_000;
    case '30s':
      return 30_000;
    case '1m':
      return 60_000;
    case '5m':
      return 300_000;
    case 'manual':
      return 100000000000000000000;
  }

  return 60_000;
};
