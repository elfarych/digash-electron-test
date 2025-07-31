import { TranslateService } from '@ngx-translate/core';
import {SortingTime, SortingType, SortingTypeRange} from '../models/Sorting';

export const getReadableSortingName = (sortingType: SortingType, translateService: TranslateService): string => {
  switch (sortingType.toLowerCase()) {
    case 'alphabetically':
      return translateService.instant("sorting.alphabetically");
    case 'volume':
      return translateService.instant("sorting.volume");
    case 'topgainers':
      return translateService.instant("sorting.topgainers");
    case 'toplosers':
      return translateService.instant("sorting.toplosers");
    case 'trades':
      return translateService.instant("sorting.trades");
    case 'volatility':
      return translateService.instant("sorting.volatility");
    case 'correlation':
      return translateService.instant("sorting.correlation");
    case 'watchlist':
      return translateService.instant("sorting.watchlist");
    case 'volumeSplash':
      return translateService.instant("sorting.volumeSplash");
  }

  return '';
};

export const getReadableSortingRangeName = (sortingRange: SortingTypeRange, translateService: TranslateService): string => {
  switch (sortingRange) {
    case '5m':
      return translateService.instant("sorting.5m");
    case '15m':
      return translateService.instant("sorting.15m");
    case '30m':
      return translateService.instant("sorting.30m");
    case '1h':
      return translateService.instant("sorting.1h");
    case '2h':
      return translateService.instant("sorting.2h");
    case '6h':
      return translateService.instant("sorting.6h");
    case '12h':
      return translateService.instant("sorting.12h");
    case '24h':
      return translateService.instant("sorting.24h");
  }

  return '';
};

export const getReadableSortingTimeName = (sortingTime: SortingTime, translateService: TranslateService): string => {
  switch (sortingTime) {
    case 'realtime':
      return translateService.instant("sorting.realtime");
    case '30s':
      return translateService.instant("sorting.30s");
    case '1m':
      return translateService.instant("sorting.1m");
    case '5m':
      return translateService.instant("sorting.5m_interval");
    case 'manual':
      return translateService.instant("sorting.manual");
  }

  return '';
};
