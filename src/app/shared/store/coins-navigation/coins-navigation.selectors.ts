import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  allSortingColumns,
  CoinSortingType,
  SortingId,
} from '../../models/CoinsSorting';
import { sortCoinByWatchlist } from '../../utils/sortCoinByWatchlist';
import { selectWatchlist } from '../watchlist/watchlist.selectors';
import { CoinsNavigationState } from './coins-navigation.reducer';
import { selectAlertsByTypes } from '../alerts/alerts.selectors';
import { Alert } from '../../models/Alert';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { chartBasicTechnicalIndicatorsList } from '../../models/chart-indicators/ChartIndicators';
import { TranslateService } from '@ngx-translate/core';

export const selectCoinsNavigationFeature =
  createFeatureSelector<CoinsNavigationState>('coinsNavigation');

export const selectCoinsNavigationSettings = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.settings,
);

export const selectCoinsNavigationRawData = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.coinsData,
);

export const selectCoinsNavigationChartSettings = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.chartSettings,
);

export const selectCoinsNavigationChartIndicators = (
  translateService: TranslateService,
) =>
  createSelector(
    selectCoinsNavigationFeature,
    (state: CoinsNavigationState) =>
      state.chartSettings.technicalIndicators ||
      chartBasicTechnicalIndicatorsList(translateService).filter(
        (i) => i.defaultActive,
      ),
  );

export const selectCoinsNavigationActiveSorting = createSelector(
  selectCoinsNavigationSettings,
  (state: CoinsNavigationState['settings']) => state.sortingId,
);

export const selectCoinsNavigationSortByAlerts = createSelector(
  selectCoinsNavigationSettings,
  (state: CoinsNavigationState['settings']) => state.sort_by_alerts,
);

export const selectCoinsNavigationAutoSize = createSelector(
  selectCoinsNavigationSettings,
  (state: CoinsNavigationState['settings']) => state.navigation_auto_size,
);

export const selectCoinsNavigationActiveSortingDirection = createSelector(
  selectCoinsNavigationSettings,
  (state: CoinsNavigationState['settings']) => state.sorting_direction,
);

export const selectCoinsNavigationColumnIds = createSelector(
  selectCoinsNavigationSettings,
  (state: CoinsNavigationState['settings']) => state.columns,
);

export const selectCoinsNavigationMarket = createSelector(
  selectCoinsNavigationChartSettings,
  (state: CoinsNavigationState['chartSettings']) => state.market,
);

export const selectCoinsNavigationInitialData = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.initialCoinsNavigationData,
);

export const selectCoinsNavigationColumns = (
  translateService: TranslateService,
) =>
  createSelector(selectCoinsNavigationColumnIds, (state: SortingId[]) => {
    return allSortingColumns(translateService).filter(
      (column: CoinSortingType) => state.includes(column.id),
    );
  });
export const selectSortedCoins = createSelector(
  selectCoinsNavigationFeature,
  selectAlertsByTypes(['price']),
  selectWatchlist,
  (state: CoinsNavigationState, alerts, watchlist) => {
    const alertsSymbols = alerts
      .filter(
        (alert: Alert) =>
          alert.active && state.settings.exchange === alert.market,
      )
      .map((alert: Alert) => alert.symbol);

    let coins = [...state.coins]?.map((coin: WorkspaceCoins) => ({
      ...coin,
      hasAlert: alertsSymbols.includes(coin.symbol),
    })) as WorkspaceCoins[];

    if (state.settings.sorting === 'watchlist') {
      coins = sortCoinByWatchlist(coins, state.settings.exchange, watchlist);
    }

    if (
      state.settings.sort_by_alerts &&
      state.settings.columns.includes('Alert')
    ) {
      return [
        ...coins.filter((coin: WorkspaceCoins) => coin.hasAlert),
        ...coins.filter((coin: WorkspaceCoins) => !coin.hasAlert),
      ];
    }

    return coins;
  },
);

export const selectNavigationCoinsLoading = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.loading,
);

export const selectAllNavigationCoins = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.allCoins,
);

export const selectFromWorkspace = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.fromWorkspace,
);

export const selectWorkspaceDensities = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.densities,
);

export const selectCoinsNavigationPresets = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.presets,
);

export const selectCoinsNavigationSelectedPreset = createSelector(
  selectCoinsNavigationFeature,
  (state: CoinsNavigationState) => state.selectedPreset,
);
