import { Injectable } from '@angular/core';
import { CoinsNavigationService } from '../../store/coins-navigation/coins-navigation.service';
import { CoinSortingType, SortingId } from '../../models/CoinsSorting';
import { firstValueFrom, Observable } from 'rxjs';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { Exchange } from '../../models/Exchange';
import { SortingDirection } from '../../models/Sorting';
import { WatchlistService } from '../../store/watchlist/watchlist.service';
import { WatchlistCoin, WatchlistColor } from '../../models/Watchlist';
import { ChartSettings } from '../../models/ChartSettings';
import { Alert } from '../../models/Alert';
import { AlertsService } from '../../store/alerts/alerts.service';
import { UserData } from '../../models/Auth';
import { ChartLayout } from '../mini-chart/models/ChartLayout';
import { PreferencesService } from '../preferences/data-access/preferences.service';
import { Preferences } from '../../models/Preferences';
import { ChartNavigationFromWorkspaceModel } from '../../models/ChartNavigationFromWorkspace.model';
import { Density } from '../../utils/densities';
import { Preset } from '../../models/Preset';

@Injectable({
  providedIn: 'root',
})
export class ChartWithNavigationService {
  constructor(
    private coinsNavigationService: CoinsNavigationService,
    private watchlistService: WatchlistService,
    private alertsService: AlertsService,
    private preferenceService: PreferencesService,
  ) {}

  public getAlerts(): Observable<Alert[]> {
    return this.alertsService.getAlerts();
  }

  public getWatchlistCoins(exchange: Exchange): Observable<WatchlistCoin[]> {
    return this.watchlistService.getWatchlistCoins(exchange);
  }

  public getDensities(): Observable<Density[]> {
    return this.coinsNavigationService.getDensities();
  }

  public toggleColumn(id: SortingId): void {
    this.coinsNavigationService.toggleColumns(id);
  }

  public toggleWatchlist(symbol: string, exchange: Exchange): void {
    this.watchlistService.toggleWatchlist(symbol, exchange, 'red');
  }

  public changeWatchlistSymbolColor(
    symbol: string,
    exchange: Exchange,
    color: WatchlistColor,
  ): void {
    this.watchlistService.changeWatchlistCoinColor(symbol, exchange, color);
  }

  public async setupWorkspaceDataUpdate(
    market: Exchange,
    userData: Observable<UserData>,
  ): Promise<void> {
    const username = (await firstValueFrom(userData)).username;
    this.coinsNavigationService.setupWorkspaceDataUpdate(market, username);
  }

  public destroyWorkspaceDataUpdate(): void {
    this.coinsNavigationService.destroyWorkspaceDataUpdate();
  }

  public updateSorting(id: SortingId): void {
    this.coinsNavigationService.updateSorting(id);
  }

  public toggleSortingByAlerts(): void {
    this.coinsNavigationService.toggleSortingByAlerts();
  }
  public toggleNavigationAutoSize(): void {
    this.coinsNavigationService.toggleNavigationAutoSize();
  }

  public updateChartSettings(data: ChartSettings): void {
    this.coinsNavigationService.updateChartSettings(data);
  }

  public selectSortedCoins(): Observable<WorkspaceCoins[]> {
    return this.coinsNavigationService.selectSortedCoins();
  }

  public selectAllCoins(): Observable<WorkspaceCoins[]> {
    return this.coinsNavigationService.selectAllCoins();
  }

  public excludeExchanges(exchanges: Exchange[]): void {
    this.coinsNavigationService.excludeExchanges(exchanges);
  }

  public getFromWorkspace(): Observable<boolean> {
    return this.coinsNavigationService.selectFromWorkspace();
  }

  public getCoinsNavigationColumnIds(): Observable<SortingId[]> {
    return this.coinsNavigationService.getCoinsNavigationColumnIds();
  }

  public getNavigationCoinsLoading(): Observable<boolean> {
    return this.coinsNavigationService.getNavigationCoinsLoading();
  }

  public getCoinsNavigationColumns(): Observable<CoinSortingType[]> {
    return this.coinsNavigationService.getCoinsNavigationColumns();
  }

  public getNavigationCoinsChartSettings(): Observable<ChartSettings> {
    return this.coinsNavigationService.getNavigationCoinsChartSettings();
  }

  public getCoinsNavigationActiveSortingDirection(): Observable<SortingDirection> {
    return this.coinsNavigationService.getCoinsNavigationActiveSortingDirection();
  }

  public getCoinsNavigationActiveSorting(): Observable<SortingId> {
    return this.coinsNavigationService.getCoinsNavigationActiveSorting();
  }

  public getCoinsNavigationSortByAlerts(): Observable<boolean> {
    return this.coinsNavigationService.getNavigationSortByAlerts();
  }

  public getCoinsNavigationAutoSize(): Observable<boolean> {
    return this.coinsNavigationService.getNavigationAutoSize();
  }

  public loadCoinsNavigationFromWorkspace(
    data: ChartNavigationFromWorkspaceModel,
  ): void {
    this.coinsNavigationService.loadCoinsNavigationFromWorkspace(data);
  }

  public loadCoinsNavigationData(
    exchange: Exchange,
    sorting: boolean = true,
    filtering: boolean = true,
    forceRedirect: boolean = false,
    loading: boolean = true,
  ): void {
    this.coinsNavigationService.loadCoinsNavigationData(
      exchange,
      sorting,
      filtering,
      forceRedirect,
      loading,
    );
  }

  public loadCoinsNavigationSettings(): void {
    this.coinsNavigationService.loadCoinsNavigationSettings();
  }

  public resetNavigationColumns(): void {
    this.coinsNavigationService.resetColumns();
  }

  public initCoinsNavigationLoading(): void {}

  public loadWatchlist(): void {
    this.watchlistService.loadWatchlist();
  }

  public async updateChartLayout(chartLayout: ChartLayout): Promise<void> {
    const preferences: Preferences = await firstValueFrom(
      this.preferenceService.preferences$,
    );

    this.preferenceService.updatePreferences({ ...preferences, chartLayout });
  }

  public destroy(): void {
    this.coinsNavigationService.destroy();
  }

  public loadPresets(): void {
    this.coinsNavigationService.loadPresets();
  }

  public getPresets(): Observable<Preset[]> {
    return this.coinsNavigationService.getPresets();
  }

  public getSelectedPreset(): Observable<Preset> {
    return this.coinsNavigationService.getSelectedPreset();
  }

  public createPreset(data: Partial<Preset>): void {
    this.coinsNavigationService.createPreset(data);
  }

  public selectPreset(preset: Preset): void {
    this.coinsNavigationService.selectPreset(preset);
  }

  public editPreset(preset: Preset): void {
    this.coinsNavigationService.editPreset(preset);
  }

  public deletePreset(id: number): void {
    this.coinsNavigationService.deletePreset(id);
  }
}
