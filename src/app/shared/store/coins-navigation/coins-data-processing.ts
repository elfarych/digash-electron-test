import { ChartSettings } from '../../models/ChartSettings';
import { CoinData } from '../../models/CoinData';

import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { commonCheckCoinByFilters } from '../../utils/commonFilterCoins';
import { commonSortCoins } from '../../utils/commonSortCoins';

import { CoinsNavigationStateSettings } from './coins-navigation.reducer';

const checkDataByFilters = (
  symbol: string,
  coinData: CoinData,
  chartSettings: ChartSettings,
): boolean => {
  if (chartSettings.showOnlyActiveCoins && !coinData?.is_active) {
    return false;
  }

  return commonCheckCoinByFilters(symbol, coinData, chartSettings);
};

export const coinsDataProcessing = (
  data: { [key: string]: CoinData },
  settings: CoinsNavigationStateSettings,
  chartSettings: ChartSettings,
): WorkspaceCoins[] => {
  const result: WorkspaceCoins[] = [];
  for (const symbol in data) {
    const coinData: CoinData = data[symbol];
    if (checkDataByFilters(symbol, coinData, chartSettings)) {
      result.push({
        symbol,
        data: coinData,
      });
    }
  }

  if (settings.sorting) {
    let sortedCoins = commonSortCoins(
      result,
      settings.sorting,
      settings.sorting_range,
    );
    if (
      settings.sorting_direction === 'desc' &&
      settings.sorting !== 'watchlist'
    ) {
      sortedCoins.reverse();
    }

    if (settings.sorting === 'listing') {
      sortedCoins = [
        ...sortedCoins.filter((c) => !!c.data.listing),
        ...sortedCoins.filter((c) => !c.data.listing),
      ];
    }

    if (settings.sorting === 'trendLevels') {
      sortedCoins = [
        ...sortedCoins.filter(
          (c) => !!c.data.trend_levels?.[`distance_${settings.sorting_range}`],
        ),
        ...sortedCoins.filter(
          (c) => !c.data.trend_levels?.[`distance_${settings.sorting_range}`],
        ),
      ];
    }

    if (settings.sorting === 'horizontalLevels') {
      sortedCoins = [
        ...sortedCoins.filter(
          (c) =>
            !!c.data.horizontal_levels?.[`distance_${settings.sorting_range}`],
        ),
        ...sortedCoins.filter(
          (c) =>
            !c.data.horizontal_levels?.[`distance_${settings.sorting_range}`],
        ),
      ];
    }

    return sortedCoins.map((c) => {
      return {
        ...c,
        data: {
          ...c.data,
          use_backend_trend_levels: settings.sorting === 'trendLevels',
          use_backend_levels: settings.sorting === 'horizontalLevels',
        },
      };
    });
  }

  return result;
};

export const getWorkspaceCoinsFromData = (data: {
  [key: string]: CoinData;
}): WorkspaceCoins[] => {
  const result: WorkspaceCoins[] = [];
  for (const symbol in data) {
    const coinData: CoinData = data[symbol];
    result.push({
      symbol,
      data: coinData,
    });
  }

  return result;
};
