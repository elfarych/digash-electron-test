import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, take } from 'rxjs';
import { Alert } from '../../shared/models/Alert';
import { WatchlistCoin } from '../../shared/models/Watchlist';
import { AlertsService } from '../../shared/store/alerts/alerts.service';
import { WatchlistService } from '../../shared/store/watchlist/watchlist.service';
import { OrderbookMapStoreService } from './data-access/orderbook-map.store.service';
import {
  OrderbookMapCoinsData,
  OrderbookMapData,
  OrderbookMapSettings,
} from './utils/models';
import { DialogService } from 'primeng/dynamicdialog';
import {
  Exchange,
  ExchangeData,
  getExchangeData,
} from '../../shared/models/Exchange';
import { Preferences } from '../../shared/models/Preferences';
import { PreferencesService } from '../../shared/components/preferences/data-access/preferences.service';
import { MiniChartComponent } from '../../shared/components/mini-chart/mini-chart.component';
import { ChartSettings } from '../../shared/models/ChartSettings';
import { CoinsNavigationResources } from '../../shared/store/coins-navigation/coins-navigation.resources';
import { isMobileDevice } from '../../shared/utils/device';
import { AuthService } from 'src/app/auth/data-access/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderbookMapService {
  constructor(
    private storeService: OrderbookMapStoreService,
    private dialogService: DialogService,
    private preferencesService: PreferencesService,
    private coinsNavigationResources: CoinsNavigationResources,
    private alertsSerive: AlertsService,
    private authService: AuthService,
    private watchlistService: WatchlistService,
  ) {}

  public getWatchlistCoins(exchange: Exchange): Observable<WatchlistCoin[]> {
    return this.watchlistService.getWatchlistCoins(exchange);
  }

  public getPremiumIsActive(): Observable<boolean> {
    return this.authService.getPremiumIsActive();
  }

  public loadSettings(): void {
    this.storeService.loadSettings();
  }

  public loadOrderbookData(): void {
    this.storeService.loadOrderbookData();
  }

  public updateSettings(data: OrderbookMapSettings): void {
    this.storeService.updateSettings(data);
  }

  public getSettings(): Observable<OrderbookMapSettings> {
    return this.storeService.getSettings();
  }

  public getLoading(): Observable<boolean> {
    return this.storeService.getLoading();
  }

  public getPageLoading(): Observable<boolean> {
    return this.storeService.getPageLoading();
  }

  public getOrderbookMapData(): Observable<OrderbookMapData> {
    return this.storeService.getOrderbookMapData();
  }

  public getOrderbookMapCoinsData(): Observable<OrderbookMapCoinsData> {
    return this.storeService.getOrderbookMapCoinsData();
  }

  public getOrderbookCoins(): Observable<{ symbol: string }[]> {
    return this.storeService.getOrderbookMapCoins();
  }

  public async openChart(exchange: Exchange, coin: string): Promise<void> {
    const coinsData: OrderbookMapCoinsData = await firstValueFrom(
      this.getOrderbookMapCoinsData(),
    );
    const preferences: Preferences = await firstValueFrom(
      this.getPreferences(),
    );
    const chartSettings: ChartSettings = await firstValueFrom(
      this.getChartSettings(),
    );

    const orderbookMapSettings: OrderbookMapSettings = await firstValueFrom(
      this.getSettings(),
    );

    const watchlistCoins = await firstValueFrom(
      this.getWatchlistCoins(exchange),
    );

    const chartDialog = this.dialogService.open(MiniChartComponent, {
      width: isMobileDevice() ? '95%' : '75%',
      height: '95%',
      styleClass: 'digah-dialog chart-dialog',
      draggable: true,
      resizable: true,
      dismissableMask: true,
      showHeader: isMobileDevice(),
      header: coin,
      closable: true,
      data: {
        coin,
        coinData: coinsData[coin][exchange],
        exchange,
        preferences,
        chartSettings: this.mergeChartSettings(
          chartSettings,
          orderbookMapSettings,
          this.getExchangeDataByExchange(exchange),
        ),
        watchlistCoins,
        timeframe: orderbookMapSettings.chartTimeframe || '5m',
        dialog: true,
        showLayoutSelector: false,
        chartLayout: 'single',
        showWatchlist: true,
        fullChart: true,
        chartIndicators: chartSettings.technicalIndicators,
      },
    });

    chartDialog.onClose.pipe(take(1)).subscribe(() => {
      document.dispatchEvent(
        new CustomEvent('coin-chart-dialog-closed', { detail: coin }),
      );
    });
  }

  public getPreferences(): Observable<Preferences> {
    return this.preferencesService.preferences$;
  }

  public getChartSettings(): Observable<ChartSettings> {
    return this.coinsNavigationResources.getChartSettings();
  }

  public getAlerts(): Observable<Alert[]> {
    return this.alertsSerive.getPriceCrossingAlerts();
  }

  public mergeChartSettings(
    chartSettings: ChartSettings,
    orderbookMapSettings: OrderbookMapSettings,
    exchangeData: ExchangeData,
  ): ChartSettings {
    return {
      ...chartSettings,
      market: exchangeData.exchange,
      showLimitOrders: true,
      limitOrderDistance: 10,
      limitOrderLife:
        orderbookMapSettings.exchangesSettings[exchangeData.exchange]
          ?.limitOrderLife ?? 0,
      limitOrderFilter:
        orderbookMapSettings.exchangesSettings[exchangeData.exchange]
          ?.ordersMinSum ?? 100000,
      limitOrderCorrosionTime:
        orderbookMapSettings.exchangesSettings[exchangeData.exchange]
          ?.ordersMinCorrosionTime ?? 1,
      candlesLength: orderbookMapSettings?.chartCandlesLength ?? 500,
    };
  }

  public getExchangeDataByExchange(exchange: Exchange): ExchangeData {
    return getExchangeData(exchange);
  }
}
