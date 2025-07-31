import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Watchlist, WatchlistColor } from '../../models/Watchlist';
import { Exchange } from '../../models/Exchange';

export const WatchlistAPIActions = createActionGroup({
  source: 'Watchlist API actions',
  events: {
    'Load watchlist': emptyProps(),
    'Load watchlist success': props<{ data: Watchlist }>(),
    'Load watchlist error': props<{ errorMessage: string }>(),

    'Update watchlist data': props<{ data: Watchlist }>(),
    'Update watchlist data success': props<{ data: Watchlist }>(),
    'Update watchlist data error': props<{ errorMessage: string }>(),

    'Toggle watchlist data': props<{
      symbol: string;
      exchange: Exchange;
      color: WatchlistColor;
    }>(),
    'Change watchlist coin color': props<{
      symbol: string;
      exchange: Exchange;
      color: WatchlistColor;
    }>(),
  },
});
