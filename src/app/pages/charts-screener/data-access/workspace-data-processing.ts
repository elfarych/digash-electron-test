import { CoinData } from '../../../shared/models/CoinData';

import { Workspace, WorkspaceApiData } from '../../../shared/models/Workspace';
import {
  MultipleWorkSpaceCoins,
  WorkspaceCoins,
} from '../../../shared/models/WorkspaceCoins';
import { commonCheckCoinByFilters } from '../../../shared/utils/commonFilterCoins';
import { commonSortCoins } from '../../../shared/utils/commonSortCoins';
import { calculateFormations } from '../../../shared/utils/formations/calculateFormations';
import {
  natrIntervalsKeyMap,
  priceChangeIntervalsKayMap,
  volumeSplashIntervalsKeyMap,
} from '../../../shared/utils/intervalMaps';

const checkDataByFilters = (
  symbol: string,
  coinData: CoinData,
  workspace: Workspace,
): boolean => {
  const checkBaseFilters = commonCheckCoinByFilters(
    symbol,
    coinData,
    workspace,
  );

  if (!checkBaseFilters) return false;

  let volumeSplashCondition: boolean = true;

  if (workspace.filterVolumeSplash) {
    const splash: number =
      coinData?.volume_data?.volume_idx?.[
        volumeSplashIntervalsKeyMap[workspace.sortingTypeRange]
      ] ?? 0;

    volumeSplashCondition = splash >= workspace.filterVolumeSplashValue;
  }

  if (workspace.filterVolumeSplashPriceChange) {
    const priceChange: number =
      coinData.price_changes[
        priceChangeIntervalsKayMap[workspace.sortingTypeRange]
      ];
    volumeSplashCondition =
      Math.abs(priceChange) >= workspace.filterVolumeSplashPriceChangeValue;
    if (workspace.filterVolumeSplashDirection === 'UP') {
      volumeSplashCondition = volumeSplashCondition && priceChange > 0;
    }
    if (workspace.filterVolumeSplashDirection === 'DOWN') {
      volumeSplashCondition = volumeSplashCondition && priceChange < 0;
    }
  }

  let natrCondition: boolean = true;

  if (workspace.filterNatr) {
    const natr: number =
      coinData.natr[natrIntervalsKeyMap[workspace.sortingTypeRange]];
    natrCondition = natr >= workspace.filterNatrValue;
  }

  return volumeSplashCondition && natrCondition;
};

export const workspaceDataProcessing = (
  workspaceApiData: WorkspaceApiData,
): MultipleWorkSpaceCoins => {
  const result: MultipleWorkSpaceCoins = {};

  for (const workspaceId in workspaceApiData) {
    const workspaceData = workspaceApiData[workspaceId];

    let coins: WorkspaceCoins[] = [];
    for (const symbol in workspaceData.data) {
      const coinData: CoinData = workspaceData.data[symbol];
      if (checkDataByFilters(symbol, coinData, workspaceData.workspace)) {
        coins.push({ symbol, data: coinData });
      }
    }

    coins = calculateFormations(workspaceData.workspace, coins);

    if (
      workspaceData.workspace.showOnlyFormations &&
      workspaceData.workspace.formation !== 'None'
    ) {
      coins = coins.filter((i) => !!i.data.formation);
    }

    if (workspaceData.workspace.showOnlyWatchlistCoins) {
      coins = coins.filter((i) => {
        return !!workspaceData.watchlist[workspaceData.workspace.market].find(
          ({ symbol }) => symbol === i.symbol,
        );
      });
    }

    result[workspaceId] = commonSortCoins(
      coins,
      workspaceData.workspace.sortingType,
      workspaceData.workspace.sortingTypeRange,
    ).sort((a: WorkspaceCoins, b: WorkspaceCoins) => {
      if (a.data.formation && !b.data.formation) {
        return -1;
      } else if (!a.data.formation && b.data.formation) {
        return 1;
      } else {
        return 0;
      }
    });

    if (
      (workspaceData.workspace.formation === 'HorizontalLevels' ||
        workspaceData.workspace.formation === 'TrendLevels') &&
      workspaceData.workspace.sortByFormations
    ) {
      result[workspaceId] = coins.sort(
        (a, b) => a.data.nearest_level_distance - b.data.nearest_level_distance,
      );
    }
  }
  return result;
};
