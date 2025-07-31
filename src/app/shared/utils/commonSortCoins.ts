import {
  sortingDataKeyMap,
  sortingIntervalsKeyMap,
  SortingType,
  SortingTypeRange,
} from '../models/Sorting';
import { WorkspaceCoins } from '../models/WorkspaceCoins';
import { volumeSplashIntervalsKeyMap } from './intervalMaps';

export const commonSortCoins = (
  coins: WorkspaceCoins[],
  sortingType: SortingType,
  sortingRange: SortingTypeRange,
): WorkspaceCoins[] => {
  switch (sortingType) {
    case 'alphabetically':
      return coins.sort((a, b) =>
        a.symbol.localeCompare(b.symbol, 'en', { sensitivity: 'base' }),
      );

    case 'topLosers':
      return coins.sort((a, b) => {
        return (
          a.data[sortingDataKeyMap[sortingType]][
            sortingIntervalsKeyMap[sortingType][sortingRange]
          ] -
          b.data[sortingDataKeyMap[sortingType]][
            sortingIntervalsKeyMap[sortingType][sortingRange]
          ]
        );
      });

    case 'volatility':
    case 'trades':
    case 'volume':
    case 'topGainers':
    case 'natr':
      return coins.sort((a, b) => {
        const aValue =
          a.data[sortingDataKeyMap[sortingType]]?.[
            sortingIntervalsKeyMap[sortingType]?.[sortingRange]
          ] ?? 0;
        const bValue =
          b.data[sortingDataKeyMap[sortingType]]?.[
            sortingIntervalsKeyMap[sortingType]?.[sortingRange]
          ] ?? 0;
        return bValue - aValue;
      });

    case 'correlation':
      return coins.sort((a, b) => {
        return (
          a.data[sortingDataKeyMap[sortingType]][
            sortingIntervalsKeyMap[sortingType][sortingRange]
          ] -
          b.data[sortingDataKeyMap[sortingType]][
            sortingIntervalsKeyMap[sortingType][sortingRange]
          ]
        );
      });
    case 'funding':
      return coins.sort((a, b) => {
        return a.data.funding?.fundingRate - b.data.funding?.fundingRate;
      });

    case 'volumeSplash':
      return coins.sort((a, b) => {
        return (
          b.data.volume_data.volume_idx[
            volumeSplashIntervalsKeyMap[sortingRange]
          ] -
          a.data.volume_data.volume_idx[
            volumeSplashIntervalsKeyMap[sortingRange]
          ]
        );
      });

    case 'listing':
      return coins.sort((a, b) => {
        return (
          new Date(a.data.listing).getTime() -
          new Date(b.data.listing).getTime()
        );
      });

    case 'horizontalLevels':
      return coins.sort((a, b) => {
        return (
          a.data.horizontal_levels?.[`distance_${sortingRange}`] -
          b.data.horizontal_levels?.[`distance_${sortingRange}`]
        );
      });

    case 'trendLevels':
      return coins.sort((a, b) => {
        return (
          b.data.trend_levels?.[`distance_${sortingRange}`] -
          a.data.trend_levels?.[`distance_${sortingRange}`]
        );
      });

    default:
      return coins;
  }
};
