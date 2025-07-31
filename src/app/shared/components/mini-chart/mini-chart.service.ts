import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ExchangeManagerApiResources} from '../../api/exchange-manager-api.resources';
import {KlineStreamService} from '../../api/kline-stream.service';
import {Exchange} from '../../models/Exchange';
import {MatDialog} from '@angular/material/dialog';
import {CoinData} from '../../models/CoinData';
import {AlertsService} from '../../store/alerts/alerts.service';
import {WatchlistService} from '../../store/watchlist/watchlist.service';
import {CoinsNavigationResources} from "../../store/coins-navigation/coins-navigation.resources";
import {WatchlistColor} from "../../models/Watchlist";
import {AuthService} from "../../../auth/data-access/auth.service";
import {UserData} from "../../models/Auth";

@Injectable({
  providedIn: 'root'
})
export class MiniChartService {
  public isAuth$: Observable<boolean> = this.authService.getIsAuth();
  public isPremium$: Observable<boolean> = this.authService.getPremiumIsActive();
  public userData$: Observable<UserData> = this.authService.getUserData();

  constructor(
    private watchlistService: WatchlistService,
    private coinsNavigationResources: CoinsNavigationResources,
    private authService: AuthService
  ) {
  }

  public changeWatchlistSymbolColor(symbol: string, exchange: Exchange, color: WatchlistColor): void {
    this.watchlistService.changeWatchlistCoinColor(symbol, exchange, color);
  }

  public loadCoinData(symbol: string, exchange: Exchange): Observable<CoinData> {
    return this.coinsNavigationResources.loadCoinData(symbol, exchange);
  }

  public getCoinToSwap (exchange: Exchange, symbol: string): Observable<{ symbol: string | null }> {
    return this.coinsNavigationResources.getCoinToSwap(exchange, symbol);
  }
}
