import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectWatchlist } from '../../../shared/store/watchlist/watchlist.selectors';
import { sortCoinByWatchlist } from '../../../shared/utils/sortCoinByWatchlist';
import { WorkspaceState } from './workspace.reducer';
import { selectAlertsByTypes } from '../../../shared/store/alerts/alerts.selectors';
import { Alert } from '../../../shared/models/Alert';
import { WorkspaceCoins } from '../../../shared/models/WorkspaceCoins';

export const workspaceFeature =
  createFeatureSelector<WorkspaceState>('workspace');

export const selectWorkspaces = createSelector(
  workspaceFeature,
  (state: WorkspaceState) => state.workspaces,
);

export const selectSelectedWorkspace = createSelector(
  workspaceFeature,
  (state: WorkspaceState) => state.selectedWorkspace,
);

export const selectCreationInProgress = createSelector(
  workspaceFeature,
  (state: WorkspaceState) => state.creationInProgress,
);

export const selectWorkspaceCoins = createSelector(
  workspaceFeature,
  selectAlertsByTypes(['price']),
  selectWatchlist,
  (state: WorkspaceState, alerts, watchlist) => {
    const handledWorkspaceCoins = {};
    const alertsSymbols = alerts
      .filter((alert: Alert) => alert.active)
      .map((alert: Alert) => alert.symbol);
    for (const workspaceId in state.workspaceCoins) {
      const workspaceCoins = state.workspaceCoins[workspaceId];

      const coins = [...workspaceCoins].map((coin: WorkspaceCoins) => ({
        ...coin,
        hasAlert: alertsSymbols.includes(coin.symbol),
      }));
      const workspace = state.selectedWorkspace.find(
        (w) => w.id === Number(workspaceId),
      );

      if (workspace?.sortByAlerts || workspace?.sortingType === 'coin') {
        handledWorkspaceCoins[workspaceId] = [
          ...coins.filter((c) => c.hasAlert),
          ...coins.filter((c) => !c.hasAlert),
        ];

        if (
          workspace?.showOnlyCoinsWithAlerts &&
          workspace?.sortingType === 'coin'
        ) {
          handledWorkspaceCoins[workspaceId] = handledWorkspaceCoins[
            workspaceId
          ].filter((coin) => coin.hasAlert);
        }
      } else {
        handledWorkspaceCoins[workspaceId] = coins;
      }

      if (workspace?.sortingType === 'watchlist') {
        if (workspace.showOnlyWatchlistCoins) {
          handledWorkspaceCoins[workspaceId] = handledWorkspaceCoins[
            workspaceId
          ].filter((c) =>
            watchlist[workspace.market].some((w) => w.symbol === c.symbol),
          );
        }
        handledWorkspaceCoins[workspaceId] = sortCoinByWatchlist(
          handledWorkspaceCoins[workspaceId],
          workspace.market,
          watchlist,
        );
      }
    }
    return handledWorkspaceCoins;
  },
);

export const selectWorkspaceLoading = createSelector(
  workspaceFeature,
  (state: WorkspaceState) => state.loading,
);
