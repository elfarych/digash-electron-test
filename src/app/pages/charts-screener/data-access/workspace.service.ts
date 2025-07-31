import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Observable, Subscription, take } from 'rxjs';
import { Workspace, WorkspaceApiData } from '../../../shared/models/Workspace';
import { WorkspaceResources } from './workspace.resources';
import { Store } from '@ngrx/store';
import {
  selectCreationInProgress,
  selectSelectedWorkspace,
  selectWorkspaceCoins,
  selectWorkspaceLoading,
  selectWorkspaces,
} from './workspace.selectors';
import { WorkspaceActions, WorkspaceStreamActions } from './workspace.actions';
import { WorkspaceSettingsPopupComponent } from '../components/workspace-settings-popup/workspace-settings-popup.component';
import {
  MultipleWorkSpaceCoins,
  WorkspaceCoins,
} from '../../../shared/models/WorkspaceCoins';
import { CoinData } from '../../../shared/models/CoinData';
import { ChartWithNavigationComponent } from '../../../shared/components/chart-with-navigation/chart-with-navigation.component';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Preferences } from '../../../shared/models/Preferences';
import { PreferencesService } from '../../../shared/components/preferences/data-access/preferences.service';
import { AlertsService } from '../../../shared/store/alerts/alerts.service';
import { Alert } from '../../../shared/models/Alert';
import { AlertNotification } from '../../../shared/models/Notification';
import { NotificationsService } from '../../../shared/store/notifications/notifciations.service';
import { WatchlistService } from '../../../shared/store/watchlist/watchlist.service';
import { WatchlistCoin } from '../../../shared/models/Watchlist';
import { Exchange } from '../../../shared/models/Exchange';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService } from '../../../auth/data-access/auth.service';
import { UserData } from '../../../shared/models/Auth';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  public userData$: Observable<UserData> = this.authService.getUserData();
  private subscriptions: Subscription = new Subscription();
  private websocketWorkspaceUpdate!: WebSocketSubject<WorkspaceCoins[]>;

  constructor(
    private resources: WorkspaceResources,
    private preferencesService: PreferencesService,
    private store: Store,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private notificationsService: NotificationsService,
    private watchlistService: WatchlistService,
    private authService: AuthService,
    private translateService: TranslateService,
  ) {}

  public getWatchlist(exchange: Exchange): Observable<WatchlistCoin[]> {
    return this.watchlistService.getWatchlistCoins(exchange);
  }

  public loadWatchlist(): void {
    this.watchlistService.loadWatchlist();
  }

  public loadAlerts(): void {
    this.alertsService.loadAlerts();
  }

  public getAlerts(): Observable<Alert[]> {
    return this.alertsService.getAlerts();
  }

  public getNotifications(): Observable<AlertNotification[]> {
    return this.notificationsService.getNotifications();
  }

  public getWorkspaceLoading(): Observable<boolean> {
    return this.store.select(selectWorkspaceLoading);
  }

  public getPreferences(): Observable<Preferences> {
    return this.preferencesService.preferences$;
  }

  public setupWorkspaceDataUpdate(id: number): void {
    this.websocketWorkspaceUpdate?.complete();

    const queryParamsString: string = new URLSearchParams({
      id,
    } as unknown as Record<string, string>).toString();
    this.websocketWorkspaceUpdate = webSocket(
      `${environment.wsBaseUrl}/ws/workspace-updates?${queryParamsString}`,
    );
    this.subscriptions.add(
      this.websocketWorkspaceUpdate.subscribe((data: WorkspaceCoins[]) => {
        this.store.dispatch(
          WorkspaceStreamActions.workspaceDataUpdate({ data, id }),
        );
      }),
    );
  }

  public destroyWorkspaceDataUpdate(): void {
    this.websocketWorkspaceUpdate?.complete();
    this.subscriptions?.unsubscribe();
  }

  public loadWorkspaces(): Observable<Workspace[]> {
    return this.resources.loadWorkspaces();
  }

  public initWorkspaces(): void {
    this.store.dispatch(WorkspaceActions.loadAllWorkspaces());
  }

  public initWorkspaceCreation(data: Workspace): void {
    this.store.dispatch(WorkspaceActions.createWorkspace({ data }));
  }

  public initWorkspaceEdit(data: Workspace): void {
    this.store.dispatch(WorkspaceActions.editWorkspace({ data }));
  }

  public async initRemoveWorkspace(workspace: Workspace): Promise<void> {
    // await this.confirmationService.confirm(`Вы уверены что хотите удалить "${workspace.title}"?`, 'Удаление рабочего пространства', 'error');
    this.store.dispatch(WorkspaceActions.removeWorkspace({ id: workspace.id }));
  }

  public createWorkspace(data: Workspace): Observable<Workspace> {
    return this.resources.createWorkspace(data);
  }

  public editWorkspace(data: Workspace): Observable<Workspace[]> {
    return this.resources.editWorkspace(data);
  }

  public removeWorkspace(id: number): Observable<{}> {
    return this.resources.removeWorkspace(id);
  }

  public getWorkspaces(): Observable<Workspace[]> {
    return this.store.select(selectWorkspaces);
  }

  public selectWorkspace(id: number): void {
    this.store.dispatch(WorkspaceActions.selectWorkspace({ id }));
  }

  public selectWorkspaceMultiple(id: number): void {
    this.store.dispatch(WorkspaceActions.selectWorkspaceMultiple({ id }));
  }

  public getSelectedWorkspace(): Observable<Workspace[]> {
    return this.store.select(selectSelectedWorkspace);
  }

  public getCreationInProgress(): Observable<boolean> {
    return this.store.select(selectCreationInProgress);
  }

  public getWorkspaceCoins(): Observable<MultipleWorkSpaceCoins> {
    return this.store.select(selectWorkspaceCoins);
  }

  public async openCreateWorkspaceDialog(): Promise<void> {
    const userData = await firstValueFrom(this.authService.getUserData());

    this.dialogService.open(WorkspaceSettingsPopupComponent, {
      header: this.translateService.instant('workspace.createTitle'),
      draggable: true,
      resizable: true,
      dismissableMask: true,
      styleClass: 'app-dialog',
      data: { premium: userData?.premium_enabled },
    });
  }

  public async openEditWorkspaceDialog(data: Workspace): Promise<void> {
    const userData = await firstValueFrom(this.authService.getUserData());

    this.dialogService.open(WorkspaceSettingsPopupComponent, {
      styleClass: 'app-dialog',
      header: this.translateService.instant('workspace.editTitle'),
      draggable: true,
      resizable: true,
      dismissableMask: true,
      data: { data, edit: true, premium: userData?.premium_enabled },
    });
  }

  public openChart(
    coin: string,
    workspace: Workspace,
    coinData: CoinData,
    coins: WorkspaceCoins[],
    preferences: Preferences,
  ): void {
    const chartDialog = this.dialogService.open(ChartWithNavigationComponent, {
      width: '95%',
      height: '95%',
      styleClass: 'digah-dialog chart-dialog',
      draggable: true,
      resizable: true,
      dismissableMask: true,
      showHeader: false,
      data: {
        coin,
        workspace,
        coinData,
        coins,
        preferences,
        exchange: workspace.market,
        timeframe: workspace.timeframe,
        showDailyHighAndLow: workspace.showDailyHighAndLow,
        showLimitOrders: workspace.showLimitOrders,
        horizontalLevelsLivingTime: workspace.horizontalLevelsLivingTime,
        horizontalLevelsTouches: workspace.horizontalLevelsTouches,
        horizontalLevelsTouchesThreshold:
          workspace.horizontalLevelsTouchesThreshold,
        showHorizontalLevels: workspace.showHorizontalLevels,
        chartIndicators: workspace.technicalIndicators,
        dialog: true,
      },
    });

    chartDialog.onClose.pipe(take(1)).subscribe(() => {
      document.dispatchEvent(
        new CustomEvent('coin-chart-dialog-closed', { detail: coin }),
      );
    });
  }

  public initWorkspace(ids: number[], showLoading: boolean = true): void {
    this.store.dispatch(WorkspaceActions.initWorkspace({ ids, showLoading }));
  }

  public clearWorkspace(): void {
    this.store.dispatch(WorkspaceActions.clearWorkspaceCoins());
  }

  public resetState(): void {
    this.store.dispatch(WorkspaceActions.reset());
  }

  public loadMultipleWorkspace(ids: number[]): Observable<WorkspaceApiData> {
    return this.resources.loadMultipleWorkspace(ids);
  }

  public getExchangeCoins(exchange: Exchange): Observable<string[]> {
    return this.resources.loadExchangeCoins(exchange);
  }

  public updateWorkspacesSorting(data: number[]): void {
    this.store.dispatch(WorkspaceActions.updateWorkspacesSorting({ data }));
  }

  public updateWorkspacesSortingRequest(
    data: number[],
  ): Observable<Workspace[]> {
    return this.resources.updateWorkspacesSorting(data);
  }

  // public loadPreferences(): Observable<Preferences> {
  //   return this.resources.loadPreferences();
  // }
}
