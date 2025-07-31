import { Injectable } from '@angular/core';
import { ListingFacade } from './data-access/listing.facade';
import { firstValueFrom, Observable, take } from 'rxjs';
import { Listing } from './utils/models/listing.model';
import { CoinData } from '../../shared/models/CoinData';
import { Preferences } from '../../shared/models/Preferences';
import { DialogService } from 'primeng/dynamicdialog';
import { Exchange, getExchangeData } from '../../shared/models/Exchange';
import { PreferencesService } from '../../shared/components/preferences/data-access/preferences.service';
import { CoinsNavigationResources } from '../../shared/store/coins-navigation/coins-navigation.resources';
import { MiniChartComponent } from '../../shared/components/mini-chart/mini-chart.component';
import { ChartSettings } from '../../shared/models/ChartSettings';
import { NotificationsAPIActions } from '../../shared/store/notifications/notifications.actions';
import { Store } from '@ngrx/store';
import { AlertNotification } from '../../shared/models/Notification';
import { ListingTableComponent } from './components/listing-table/listing-table.component';
import {normalizeCoinQuoteSymbol} from "../../shared/utils/normalizeCoinQuoteSymbol";

@Injectable({ providedIn: 'root' })
export class ListingService {
  constructor(
    private store: Store,
    private facade: ListingFacade,
    private dialogService: DialogService,
    private preferencesService: PreferencesService,
    private coinDataResources: CoinsNavigationResources,
    private coinsNavigationResources: CoinsNavigationResources,
  ) {}

  public getListings(): Observable<Listing[]> {
    return this.facade.getListings();
  }

  public loadListings(): void {
    this.facade.loadListings();
  }

  public getPreferences(): Observable<Preferences> {
    return this.preferencesService.preferences$;
  }

  public getChartSettings(): Observable<ChartSettings> {
    return this.coinsNavigationResources.getChartSettings();
  }

  public getCoinData(symbol: string, exchange: Exchange): Observable<CoinData> {
    return this.coinDataResources.loadCoinData(symbol, exchange);
  }

  public openListingNotificationsDialog(
    notifications: AlertNotification[],
  ): void {
    if (!notifications.length) return void 0;

    if (notifications.length === 1) {
      const { symbol, exchange, notification_id } = notifications[0];
      this.openChart(symbol, exchange, notification_id);
    } else {
      this.openListingTableDialog(notifications);
    }
  }

  public openListingTableDialog(notifications: AlertNotification[]): void {
    const dialog = this.dialogService.open(ListingTableComponent, {
      header: `Листинги`,
      width: '95%',
      height: 'auto',
      modal: true,
      baseZIndex: 10,
      showHeader: true,
      data: {
        dialog: true,
        notifications,
      },
    });

    dialog.onClose.pipe(take(1)).subscribe(() => {
      notifications.forEach((notification) => {
        this.store.dispatch(
          NotificationsAPIActions.viewNotification({
            notificationId: notification.notification_id,
          }),
        );
      });
    });
  }

  public async openChart(
    coin: string,
    exchange: Exchange,
    notificationId: number = 0,
  ): Promise<void> {
    const coinData: CoinData = await firstValueFrom(
      this.getCoinData(coin, exchange),
    );
    const preferences: Preferences = await firstValueFrom(
      this.getPreferences(),
    );
    const chartSettings: ChartSettings = await firstValueFrom(
      this.getChartSettings(),
    );
    const dialog = this.dialogService.open(MiniChartComponent, {
      header: `Листинг ${normalizeCoinQuoteSymbol(coin)}USDT ${getExchangeData(coinData.market)?.name ?? ''}`,
      width: '70%',
      height: '90%',
      styleClass: 'digah-dialog',
      draggable: true,
      modal: true,
      resizable: true,
      baseZIndex: 20,
      dismissableMask: true,
      showHeader: true,
      data: {
        coin,
        coinData,
        preferences,
        exchange: coinData.market,
        chartSettings,
        timeframe: chartSettings.timeframe || '5m',
        chartLayout: 'single',
        dialog: true,
        showWatchlist: false,
        fullChart: true
      },
    });

    if (notificationId) {
      dialog.onClose.pipe(take(1)).subscribe(() => {
        this.store.dispatch(
          NotificationsAPIActions.viewNotification({
            notificationId,
          }),
        );
      });
    }
  }
}
