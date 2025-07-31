import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderbookMapState } from './orderbook-map.reducer';

export const orderbookMapFeature =
  createFeatureSelector<OrderbookMapState>('orderbookMap');

export const selectOrderbookMapData = createSelector(
  orderbookMapFeature,
  (state: OrderbookMapState) => state.orderbookData,
);

export const selectOrderbookMapSettings = createSelector(
  orderbookMapFeature,
  (state: OrderbookMapState) => state.settings,
);

export const selectOrderbookMapLoading = createSelector(
  orderbookMapFeature,
  (state: OrderbookMapState) => state.loading,
);

export const selectOrderbookMapPageLoading = createSelector(
  orderbookMapFeature,
  (state: OrderbookMapState) => state.pageLoading,
);

export const selectOrderbookMapCoinsData = createSelector(
  orderbookMapFeature,
  (state: OrderbookMapState) => state.coinsData,
);

export const selectOrderbookMapCoins = createSelector(
  orderbookMapFeature,
  (state: OrderbookMapState) => {
    if (state.coinsData) {
      return Object.keys(state.coinsData)
        .filter((symbol) => !state.settings?.blacklist.includes(symbol))
        .map((symbol) => ({ symbol }));
    }
    return [];
  },
);
