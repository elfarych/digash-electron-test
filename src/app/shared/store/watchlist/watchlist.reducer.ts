import { Watchlist } from '../../models/Watchlist';
import { createReducer, on } from '@ngrx/store';
import { WatchlistAPIActions } from './watchlist.actions';

export const initialWatchlistState: Watchlist = {};

export const watchlistReducer = createReducer(
  initialWatchlistState,

  on(
    WatchlistAPIActions.loadWatchlistSuccess,
    WatchlistAPIActions.updateWatchlistDataSuccess,
    (state, { data }) => data,
  ),
);
