import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {WatchlistResources} from './watchlist.resources';
import {map, mergeMap, withLatestFrom} from 'rxjs';
import {WatchlistAPIActions} from './watchlist.actions';
import {Watchlist, WatchlistColor} from '../../models/Watchlist';
import {selectWatchlistFeature} from './watchlist.selectors';
import {Exchange} from '../../models/Exchange';
import {AuthActions} from '../../../auth/data-access/auth.actions';

@Injectable()
export class WatchlistEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private resources: WatchlistResources,
  ) {
  }

  private loadCoinsNavigationData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WatchlistAPIActions.loadWatchlist),
      mergeMap(() =>
        this.resources
          .loadWatchlist()
          .pipe(
            map(({data}: { data: Watchlist }) =>
              WatchlistAPIActions.loadWatchlistSuccess({data}),
            ),
          ),
      ),
    ),
  );

  private updateWatchlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WatchlistAPIActions.updateWatchlistData),
      mergeMap(({data}: { data: Watchlist }) =>
        this.resources
          .updateWatchlist(data)
          .pipe(
            map(({data}: { data: Watchlist }) =>
              WatchlistAPIActions.updateWatchlistDataSuccess({data}),
            ),
          ),
      ),
    ),
  );

  private toggleWatchlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WatchlistAPIActions.toggleWatchlistData),
      withLatestFrom(this.store.select(selectWatchlistFeature)),
      map(
        ([{exchange, symbol, color}, watchlist]: [
          { exchange: Exchange; symbol: string; color: WatchlistColor },
          Watchlist,
        ]) =>
          WatchlistAPIActions.updateWatchlistData({
            data: this.getUpdatedWatchlistDataToggle(
              watchlist,
              symbol,
              exchange,
              color,
            ),
          }),
      ),
    ),
  );

  private changeWatchlistCoinColor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WatchlistAPIActions.changeWatchlistCoinColor),
      withLatestFrom(this.store.select(selectWatchlistFeature)),
      map(
        ([{exchange, symbol, color}, watchlist]: [
          { exchange: Exchange; symbol: string; color: WatchlistColor },
          Watchlist,
        ]) => this.getUpdatedWatchlistDataColor(watchlist, symbol, exchange, color,)
      ),
      map(data => WatchlistAPIActions.updateWatchlistData({data}))
    ),
  );


  private loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setTokens),
      map(() => WatchlistAPIActions.loadWatchlist()),
    ),
  );

  private getUpdatedWatchlistDataColor(
    watchlist: Watchlist,
    symbol: string,
    exchange: Exchange,
    color: WatchlistColor,
  ): Watchlist {
    const result = JSON.parse(JSON.stringify(watchlist));

    if (!result.hasOwnProperty(exchange)) {
      result[exchange] = [{symbol, color}];
      return result;
    }

    const idx: number = result[exchange].findIndex(
      (value) => value.symbol === symbol,
    );

    if (color === 'clear') {
      if (idx !== -1) {
        result[exchange].splice(idx, 1);
      }

      return result;
    }

    if (idx === -1) {
      result[exchange].push({symbol, color});
    } else {
      result[exchange][idx].color = color;
    }

    return result;
  }

  private getUpdatedWatchlistDataToggle(
    watchlist: Watchlist,
    symbol: string,
    exchange: Exchange,
    color: WatchlistColor,
  ): Watchlist {
    const result = JSON.parse(JSON.stringify(watchlist));

    if (!result.hasOwnProperty(exchange)) {
      result[exchange] = [{symbol, color}];
      return result;
    }

    const idx: number = result[exchange].findIndex(
      (value) => value.symbol === symbol,
    );
    if (idx === -1) {
      result[exchange].push({symbol, color});
    } else {
      result[exchange].splice(idx, 1);
    }

    return result;
  }
}
