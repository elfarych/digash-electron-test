import { Injectable } from '@angular/core';
import { CoinsNavigationResources } from './coins-navigation.resources';
import { CoinSortingType, SortingId } from '../../models/CoinsSorting';
import { Store } from '@ngrx/store';
import {
  selectAllNavigationCoins,
  selectCoinsNavigationActiveSorting,
  selectCoinsNavigationActiveSortingDirection,
  selectCoinsNavigationAutoSize,
  selectCoinsNavigationChartIndicators,
  selectCoinsNavigationChartSettings,
  selectCoinsNavigationColumnIds,
  selectCoinsNavigationColumns,
  selectCoinsNavigationPresets,
  selectCoinsNavigationSelectedPreset,
  selectCoinsNavigationSortByAlerts,
  selectFromWorkspace,
  selectNavigationCoinsLoading,
  selectSortedCoins,
  selectWorkspaceDensities,
} from './coins-navigation.selectors';
import { Observable } from 'rxjs';
import { SortingDirection } from '../../models/Sorting';
import {
  CoinNavigationChartSettingsActions,
  CoinsNavigationActions,
  CoinsNavigationStreamActions,
} from './coins-navigation.actions';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { Exchange } from '../../models/Exchange';
import { ChartSettings } from '../../models/ChartSettings';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../../environments/environment';
import { ChartTechnicalIndicators } from '../../models/chart-indicators/ChartIndicators';
import { TranslateService } from '@ngx-translate/core';
import { ChartNavigationFromWorkspaceModel } from '../../models/ChartNavigationFromWorkspace.model';
import { Density } from '../../utils/densities';
import { Preset } from '../../models/Preset';

@Injectable({
  providedIn: 'root',
})
export class CoinsNavigationService {
  private websocketChartDataUpdate!: WebSocketSubject<WorkspaceCoins[]>;

  constructor(
    private resources: CoinsNavigationResources,
    private store: Store,
    private translateService: TranslateService,
  ) {}

  public getCoinsNavigationActiveSorting(): Observable<SortingId> {
    return this.store.select(selectCoinsNavigationActiveSorting);
  }

  public getCoinsNavigationActiveSortingDirection(): Observable<SortingDirection> {
    return this.store.select(selectCoinsNavigationActiveSortingDirection);
  }

  public getDensities(): Observable<Density[]> {
    return this.store.select(selectWorkspaceDensities);
  }

  public selectSortedCoins(): Observable<WorkspaceCoins[]> {
    return this.store.select(selectSortedCoins);
  }

  public selectAllCoins(): Observable<WorkspaceCoins[]> {
    return this.store.select(selectAllNavigationCoins);
  }

  public selectFromWorkspace(): Observable<boolean> {
    return this.store.select(selectFromWorkspace);
  }

  public setupWorkspaceDataUpdate(market: Exchange, username: string): void {
    this.websocketChartDataUpdate?.complete();
    this.websocketChartDataUpdate?.unsubscribe();

    const queryParamsString: string = new URLSearchParams({
      market,
      username,
    } as unknown as Record<string, string>).toString();
    this.websocketChartDataUpdate = webSocket(
      `${environment.wsBaseUrl}/ws/chart-updates?${queryParamsString}`,
    );
    this.websocketChartDataUpdate.subscribe((data: WorkspaceCoins[]) => {
      this.store.dispatch(
        CoinsNavigationStreamActions.coinsNavigationDataUpdate({ data }),
      );
    });
  }

  public destroyWorkspaceDataUpdate(): void {
    this.websocketChartDataUpdate?.complete();
    this.websocketChartDataUpdate?.unsubscribe();
    this.websocketChartDataUpdate = undefined;
  }

  public getCoinsNavigationColumnIds(): Observable<SortingId[]> {
    return this.store.select(selectCoinsNavigationColumnIds);
  }

  public getCoinsNavigationColumns(): Observable<CoinSortingType[]> {
    return this.store.select(
      selectCoinsNavigationColumns(this.translateService),
    );
  }

  public getNavigationCoinsLoading(): Observable<boolean> {
    return this.store.select(selectNavigationCoinsLoading);
  }

  public getNavigationCoinsChartSettings(): Observable<ChartSettings> {
    return this.store.select(selectCoinsNavigationChartSettings);
  }

  public getNavigationSortByAlerts(): Observable<boolean> {
    return this.store.select(selectCoinsNavigationSortByAlerts);
  }

  public getNavigationAutoSize(): Observable<boolean> {
    return this.store.select(selectCoinsNavigationAutoSize);
  }

  public loadCoinsNavigationFromWorkspace(
    data: ChartNavigationFromWorkspaceModel,
  ): void {
    this.store.dispatch(
      CoinsNavigationActions.loadCoinsNavigationFromWorkspace({ data }),
    );
  }

  public loadCoinsNavigationData(
    exchange: Exchange,
    sorting: boolean = true,
    filtering: boolean = true,
    forceRedirect: boolean = false,
    loading: boolean = true,
  ): void {
    this.store.dispatch(
      CoinsNavigationActions.loadCoinsNavigationData({
        exchange,
        sorting,
        filtering,
        forceRedirect,
        loading,
      }),
    );
  }

  public loadCoinsNavigationSettings(): void {
    this.store.dispatch(CoinsNavigationActions.loadCoinsNavigationSettings());
  }

  public toggleColumns(id: SortingId): void {
    this.store.dispatch(CoinsNavigationActions.toggleColumn({ id }));
  }

  public excludeExchanges(exchanges: Exchange[]): void {
    this.store.dispatch(CoinsNavigationActions.excludeExchanges({ exchanges }));
  }

  public toggleSortingByAlerts(): void {
    this.store.dispatch(CoinsNavigationActions.toggleSortingByAlerts());
  }

  public toggleNavigationAutoSize(): void {
    this.store.dispatch(CoinsNavigationActions.toggleNavigationAutoSize());
  }

  public resetColumns(): void {
    this.store.dispatch(CoinsNavigationActions.resetColumns());
  }

  public updateSorting(id: SortingId): void {
    this.store.dispatch(CoinsNavigationActions.changeSortingColumn({ id }));
  }

  public updateChartSettings(data: ChartSettings): void {
    this.store.dispatch(
      CoinNavigationChartSettingsActions.updateChartSettings({ data }),
    );
  }

  public getChartSettings(): Observable<ChartSettings> {
    return this.store.select(selectCoinsNavigationChartSettings);
  }

  public getChartIndicators(): Observable<ChartTechnicalIndicators[]> {
    return this.store.select(
      selectCoinsNavigationChartIndicators(this.translateService),
    );
  }

  public loadPresets(): void {
    this.store.dispatch(CoinsNavigationActions.loadPresets());
  }

  public getPresets(): Observable<Preset[]> {
    return this.store.select(selectCoinsNavigationPresets);
  }

  public getSelectedPreset(): Observable<Preset> {
    return this.store.select(selectCoinsNavigationSelectedPreset);
  }

  public createPreset(data: Partial<Preset>): void {
    this.store.dispatch(CoinsNavigationActions.createPreset({ data }));
  }

  public selectPreset(preset: Preset): void {
    this.store.dispatch(CoinsNavigationActions.selectPreset({ preset }));
  }

  public editPreset(preset: Preset): void {
    this.store.dispatch(CoinsNavigationActions.updatePreset({ data: preset }));
  }

  public deletePreset(id: number): void {
    this.store.dispatch(CoinsNavigationActions.deletePreset({ id }));
  }

  public destroy(): void {
    this.store.dispatch(CoinsNavigationActions.destroy());
  }
}
