import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DepthMapState } from './depth-map.reducer';

export const depthMapFeature = createFeatureSelector<DepthMapState>('depthMap');

export const selectDepthMapData = createSelector(
  depthMapFeature,
  (state: DepthMapState) => state.depthData,
);

export const selectDepthMapSettings = createSelector(
  depthMapFeature,
  (state: DepthMapState) => state.settings,
);

export const selectDepthMapLoading = createSelector(
  depthMapFeature,
  (state: DepthMapState) => state.loading,
);

export const selectDepthMapCoinsData = createSelector(
  depthMapFeature,
  (state: DepthMapState) => state.coinsData,
);

export const selectDepthMapCoins = createSelector(
  depthMapFeature,
  (state: DepthMapState) => {
    if (state.coinsData) {
      return Object.keys(state.coinsData)
        .filter((symbol) => !state.settings?.blacklist.includes(symbol))
        .map((symbol) => ({ symbol }));
    }
    return [];
  },
);
