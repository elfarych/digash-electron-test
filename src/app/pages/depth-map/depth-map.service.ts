import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, take } from 'rxjs';
import { DepthMapStoreService } from './data-access/depth-map.store.service';
import {
  DepthMapCoinsData,
  DepthMapData,
  DepthMapSettings,
} from './utils/models';
import { DialogService } from 'primeng/dynamicdialog';
import { Exchange } from '../../shared/models/Exchange';
import { Preferences } from '../../shared/models/Preferences';
import { PreferencesService } from '../../shared/components/preferences/data-access/preferences.service';
import { MiniChartComponent } from '../../shared/components/mini-chart/mini-chart.component';
import { ChartSettings } from '../../shared/models/ChartSettings';
import { CoinsNavigationResources } from '../../shared/store/coins-navigation/coins-navigation.resources';
import { isMobileDevice } from '../../shared/utils/device';

@Injectable({
  providedIn: 'root',
})
export class DepthMapService {
  constructor(
    private storeService: DepthMapStoreService,
    private dialogService: DialogService,
    private preferencesService: PreferencesService,
    private coinsNavigationResources: CoinsNavigationResources,
  ) {}

  public loadSettings(): void {
    this.storeService.loadSettings();
  }

  public loadDepthData(): void {
    this.storeService.loadDepthData();
  }

  public updateSettings(data: DepthMapSettings): void {
    this.storeService.updateSettings(data);
  }

  public getSettings(): Observable<DepthMapSettings> {
    return this.storeService.getSettings();
  }

  public getLoading(): Observable<boolean> {
    return this.storeService.getLoading();
  }

  public getDepthData(): Observable<DepthMapData> {
    return this.storeService.getDepthData();
  }

  public getDepthCoinsData(): Observable<DepthMapCoinsData> {
    return this.storeService.getDepthCoinsData();
  }

  public getDepthCoins(): Observable<{ symbol: string }[]> {
    return this.storeService.getDepthCoins();
  }

  public async openChart(exchange: Exchange, coin: string): Promise<void> {
    const coinsData: DepthMapCoinsData = await firstValueFrom(
      this.getDepthCoinsData(),
    );
    const preferences: Preferences = await firstValueFrom(
      this.getPreferences(),
    );
    const chartSettings: ChartSettings = await firstValueFrom(
      this.getChartSettings(),
    );

    const depthMapSettings: DepthMapSettings = await firstValueFrom(
      this.getSettings(),
    );

    const chartDialog = this.dialogService.open(MiniChartComponent, {
      width: isMobileDevice() ? '95%' : '75%',
      height: '75%',
      styleClass: 'digah-dialog chart-dialog',
      draggable: true,
      resizable: true,
      dismissableMask: true,
      showHeader: false,
      closable: true,
      data: {
        coin,
        coinData: coinsData[coin][exchange],
        exchange,
        preferences,
        chartSettings,
        timeframe: depthMapSettings.chartTimeframe || '5m',
        dialog: true,
        chartLayout: 'single',
        showWatchlist: false,
        fullChart: false,
      },
    });

    chartDialog.onClose.pipe(take(1)).subscribe(() => {
      document.dispatchEvent(
        new CustomEvent('coin-chart-dialog-closed', { detail: coin }),
      );
    });
  }

  private getPreferences(): Observable<Preferences> {
    return this.preferencesService.preferences$;
  }

  private getChartSettings(): Observable<ChartSettings> {
    return this.coinsNavigationResources.getChartSettings();
  }
}
