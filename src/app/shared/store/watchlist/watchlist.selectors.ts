import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Watchlist } from '../../models/Watchlist';
import { Exchange } from '../../models/Exchange';

export const selectWatchlistFeature =
  createFeatureSelector<Watchlist>('watchlist');

export const selectWatchlistCoinsByExchange = (exchange: Exchange) =>
  createSelector(
    selectWatchlistFeature,
    (state: Watchlist) => state?.[exchange] ?? [],
  );

export const selectWatchlist = createSelector(
  selectWatchlistFeature,
  (state: Watchlist) => state,
);
