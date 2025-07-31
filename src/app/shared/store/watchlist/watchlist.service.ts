import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { WatchlistAPIActions } from './watchlist.actions';
import { Exchange } from '../../models/Exchange';
import { WatchlistCoin, WatchlistColor } from '../../models/Watchlist';
import { selectWatchlistCoinsByExchange } from './watchlist.selectors';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  constructor(private store: Store) {}

  public loadWatchlist(): void {
    this.store.dispatch(WatchlistAPIActions.loadWatchlist());
  }

  public toggleWatchlist(
    symbol: string,
    exchange: Exchange,
    color: WatchlistColor,
  ): void {
    this.store.dispatch(
      WatchlistAPIActions.toggleWatchlistData({ symbol, exchange, color }),
    );
  }

  public changeWatchlistCoinColor(
    symbol: string,
    exchange: Exchange,
    color: WatchlistColor,
  ): void {
    this.store.dispatch(
      WatchlistAPIActions.changeWatchlistCoinColor({ symbol, exchange, color }),
    );
  }

  public getWatchlistCoins(exchange: Exchange): Observable<WatchlistCoin[]> {
    return this.store.select(selectWatchlistCoinsByExchange(exchange));
  }

  public clearWatchList(): void {
    return this.store.dispatch(
      WatchlistAPIActions.updateWatchlistData({ data: {} }),
    );
  }
}
