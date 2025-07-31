import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipsComponent } from '../../shared/components/tooltips/tooltips.component';
import { UserData } from '../../shared/models/Auth';
import { getExchangeData } from '../../shared/models/Exchange';
import { Timeframe } from '../../shared/models/Timeframe';
import { Workspace } from '../../shared/models/Workspace';
import { TabsComponent } from './components/tabs/tabs.component';
import { WorkspaceTimeframeSelectorComponent } from './components/workspace-timeframe-selector/workspace-timeframe-selector.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AppGuardComponent } from '../../shared/components/app-guard/app-guard.component';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  interval,
  mapTo,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { WorkspaceService } from './data-access/workspace.service';
import { MultipleWorkSpaceCoins } from '../../shared/models/WorkspaceCoins';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PreferencesComponent } from '../../shared/components/preferences/preferences.component';
import { Preferences } from '../../shared/models/Preferences';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { ScrollTopComponent } from '../../shared/components/scroll-top/scroll-top.component';
import { Alert } from '../../shared/models/Alert';
import { AlertNotification } from '../../shared/models/Notification';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { sortingTimeToMs } from '../../shared/utils/sortingTimeToMs';
import { WatchlistCoin } from '../../shared/models/Watchlist';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TooltipModule } from 'primeng/tooltip';
import { UnauthorizedDirective } from '../../shared/directives/unauthorized.directive';
import { PremiumForbiddenDialogService } from '../../shared/components/premium-forbidden-dialog/premium-forbidden-dialog.service';
import { AuthService } from '../../auth/data-access/auth.service';
import { SplitterModule } from 'primeng/splitter';
import { NightVisionChartService } from '../../shared/components/night-vision-chart/night-vision-chart.service';
import { ToastModule } from 'primeng/toast';
import { DragDropModule } from 'primeng/dragdrop';
import { Subject } from 'rxjs/internal/Subject';
import { ChartTechnicalIndicators } from '../../shared/models/chart-indicators/ChartIndicators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollTopButtonDirective } from '../../shared/directives/scroll-top.directive';
import { WorkspaceMobileMenuComponent } from './components/workspace-mobile-menu/workspace-mobile-menu.component';

@Component({
  selector: 'app-charts-screener',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    TabsComponent,
    WorkspaceComponent,
    AppGuardComponent,
    MatSidenavModule,
    PreferencesComponent,
    ProgressSpinnerComponent,
    ScrollTopComponent,
    MatButtonModule,
    FooterComponent,
    TabViewModule,
    ButtonModule,
    ScrollTopModule,
    ConfirmPopupModule,
    TooltipModule,
    UnauthorizedDirective,
    SplitterModule,
    ToastModule,
    DragDropModule,
    TooltipsComponent,
    TranslateModule,
    DropdownModule,
    WorkspaceTimeframeSelectorComponent,
    ScrollTopButtonDirective,
    WorkspaceMobileMenuComponent,
  ],
  templateUrl: './charts-screener.component.html',
  styleUrls: ['./charts-screener.component.scss'],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsScreenerComponent implements OnInit, OnDestroy {
  public workspaces$: Observable<Workspace[]> = this.service.getWorkspaces();
  public workspaces: Workspace[] = [];
  public selectedWorkspace$: Observable<Workspace[]> =
    this.service.getSelectedWorkspace();
  public workspaceCoins$: Observable<MultipleWorkSpaceCoins> =
    this.service.getWorkspaceCoins();
  public preferences$: Observable<Preferences> = this.service.getPreferences();
  public loading$: Observable<boolean> = this.service.getWorkspaceLoading();
  public userData$: Observable<UserData> = this.authService.getUserData();
  public alerts$: Observable<Alert[]> = this.service.getAlerts();
  public notifications$: Observable<AlertNotification[]> =
    this.service.getNotifications();
  public watchlistCoins$: Observable<WatchlistCoin[]> = of([]);
  public activeIndex = 0;

  public selectedWorkspaces: number[] = [];
  public workspaceLink: boolean = false;

  private subscriptions: Subscription = new Subscription();
  private updateDataInterval$: Subscription;
  private workspaceSubscriptions: Map<string, Subscription> = new Map();
  private workspaceToUpdateSubject$: Subject<Workspace> =
    new Subject<Workspace>();

  private draggedWorkspace!: Workspace;

  constructor(
    private service: WorkspaceService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private premiumForbiddenDialogService: PremiumForbiddenDialogService,
    private authService: AuthService,
    private nightVisionService: NightVisionChartService,
    private messageService: MessageService,
    private translateService: TranslateService,
  ) {
    this.service.initWorkspaces();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.selectedWorkspace$.subscribe(() => this.initWorkspace()),
    );
    this.subscriptions.add(
      this.workspaces$.subscribe(
        (data: Workspace[]) =>
          (this.workspaces = JSON.parse(JSON.stringify(data))),
      ),
    );
    this.subscriptions.add(
      this.workspaceToUpdateSubject$
        .pipe(
          debounceTime(500),
          distinctUntilChanged(
            (prevWorkspace, currWorkspace) =>
              prevWorkspace.id === currWorkspace.id &&
              JSON.stringify(prevWorkspace) === JSON.stringify(currWorkspace),
          ),
        )
        .subscribe((workspace: Workspace) => {
          this.service.initWorkspaceEdit(workspace);
        }),
    );
    this.service.loadAlerts();
    this.nightVisionService.destroyAll();
  }

  public ngOnDestroy(): void {
    this.nightVisionService.destroyAll();
    // this.service.resetState();
    this.service.destroyWorkspaceDataUpdate();
    this.subscriptions?.unsubscribe();
    this.updateDataInterval$?.unsubscribe();
    this.updateDataInterval$ = undefined;
  }

  public get isDesktop(): boolean {
    return window.innerWidth > 992;
  }

  public workspaceTrackBy(index: number, value: Workspace): number {
    return value.id;
  }

  public changeWorkspaceTimeframe(
    timeframe: Timeframe,
    workspace: Workspace,
  ): void {
    this.service.initWorkspaceEdit({ ...workspace, timeframe });
  }

  public selectedWorkspaceTrackBy(index: number, value: Workspace): number {
    return value.id;
  }

  public handleLink(): void {
    this.workspaceLink = !this.workspaceLink;

    if (this.workspaceLink) {
      this.messageService.add({
        severity: 'info',
        detail: this.translateService.instant(
          'workspace.secondWorkspaceChoice',
        ),
      });
    }
  }

  public handleOpenSettings(event: MouseEvent, data: Workspace): void {
    event.preventDefault();
    event.stopPropagation();
    this.editWorkspace(data);
  }

  public handleRemove(event: MouseEvent, data: Workspace): void {
    event.preventDefault();
    event.stopPropagation();
    this.removeTab(data);
  }

  public async selectWorkspace(
    event: MouseEvent,
    workspace: Workspace,
  ): Promise<void> {
    this.workspaceSubscriptions.clear();
    {
      if (event.shiftKey || this.workspaceLink) {
        const userData = await firstValueFrom(this.service.userData$);
        if (!userData) {
          this.authService.openAuthPopup('register');
          return void 0;
        }

        if (!userData.premium_enabled) {
          this.premiumForbiddenDialogService.open(
            'Активация нескольких рабочих пространств открывается в премиум доступе',
          );
          return void 0;
        }

        this.service.selectWorkspaceMultiple(workspace.id);
      } else {
        this.service.selectWorkspace(workspace.id);
      }
    }
  }

  public async createTab(workspaces: Workspace[]): Promise<void> {
    const userData = await firstValueFrom(this.service.userData$);

    if (!userData) {
      this.authService.openAuthPopup('register');
      return void 0;
    }

    if (workspaces?.length >= 2 && !userData?.premium_enabled) {
      this.premiumForbiddenDialogService.open(
        'Неограниченное кол-во рабочих пространств можно создавать в премиум доступе',
      );
      return void 0;
    }

    this.service.openCreateWorkspaceDialog();
  }

  public removeTab(workspace: Workspace): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('workspace.deleteWorkspace'),
      message: `${this.translateService.instant('workspace.deleteWorkspaceQuestion')} "${workspace.title}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translateService.instant('workspace.yes'),
      rejectLabel: this.translateService.instant('workspace.cancel'),
      accept: () => {
        this.service.initRemoveWorkspace(workspace);
      },
    });
  }

  public editWorkspace(workspace: Workspace): void {
    this.service.openEditWorkspaceDialog(workspace);
  }

  public updateSorting(): void {
    this.initWorkspace(false);
  }

  public getWorkspaceActiveStatus(
    workspace: Workspace,
    selectedWorkspaces: Workspace[],
  ): boolean {
    return !!selectedWorkspaces.find((w) => w.id === workspace.id);
  }

  public onWorkspaceDragStart(event: DragEvent, workspace: Workspace): void {
    this.draggedWorkspace = workspace;
  }

  public onWorkspaceDragEnter(workspace: Workspace): void {
    const draggedWorkspaceNewIndex: number = this.workspaces.findIndex(
      (w) => w.id === workspace.id,
    );
    const draggedWorkspaceIndex: number = this.workspaces.findIndex(
      (w) => w.id === this.draggedWorkspace.id,
    );
    this.workspaces.splice(draggedWorkspaceIndex, 1);
    this.workspaces.splice(draggedWorkspaceNewIndex, 0, this.draggedWorkspace);
    this.cdr.detectChanges();
  }

  public async onWorkspaceDragEnd(): Promise<void> {
    this.service.updateWorkspacesSorting(this.workspaces.map((w) => w.id));
    this.draggedWorkspace = undefined;
  }

  public onCandlesLenUpdate(candlesLength: number, workspace: Workspace): void {
    this.workspaceToUpdateSubject$.next({
      ...workspace,
      candlesLength,
    });
  }

  public onIndicatorsUpdate(
    indicators: ChartTechnicalIndicators[],
    workspace: Workspace,
  ): void {
    this.workspaceToUpdateSubject$.next({
      ...workspace,
      technicalIndicators: indicators,
    });
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.code.toLowerCase() === 'keyr') {
      this.updateSorting();
    }

    if (event.shiftKey && event.code.toLowerCase() === 'keys') {
      this.openSelectedWorkSpaceSettings();
    }

    if (event.key === 'ArrowRight') {
      this.selectNextWorkspace(1);
    }
    if (event.key === 'ArrowLeft') {
      this.selectNextWorkspace(-1);
    }

    if ((event.shiftKey && event.key === '+') || event.key === '=') {
      this.createWorkspace();
    }
  }

  private async createWorkspace(): Promise<void> {
    const workspaces = await firstValueFrom(this.workspaces$);
    await this.createTab(workspaces);
  }

  private async selectNextWorkspace(next: -1 | 1): Promise<void> {
    const selectedWorkspace = await firstValueFrom(this.selectedWorkspace$);
    const workspaces = await firstValueFrom(this.workspaces$);
    const index = workspaces.findIndex(
      (w) => w.id === selectedWorkspace[0]?.id,
    );

    if (index !== -1) {
      if (workspaces[index + next]) {
        this.service.selectWorkspace(workspaces[index + next].id);
      }
    }
  }

  private async openSelectedWorkSpaceSettings(): Promise<void> {
    const workspace = await firstValueFrom(this.selectedWorkspace$);
    this.editWorkspace(workspace[0]);
  }

  private async initWorkspace(showLoading: boolean = true): Promise<void> {
    const selectedWorkspace = await firstValueFrom(this.selectedWorkspace$);
    if (!selectedWorkspace) {
      return void 0;
    }

    this.updateDataInterval$?.unsubscribe();
    this.updateDataInterval$ = undefined;
    this.service.clearWorkspace();
    this.service.initWorkspace(
      selectedWorkspace.map((w) => w?.id),
      showLoading,
    );

    this.updateDataInterval$ = of(selectedWorkspace)
      .pipe(
        filter(Boolean),
        filter(
          (workspace: Workspace[]) => workspace[0]?.sortingTime !== 'manual',
        ),
        // filter((workspace: Workspace) => workspace.sortingTime !== 'manual' && workspace.sortingTime !== 'realtime'),
        // switchMap(workspace => interval(5000).pipe(mapTo(workspace)))
        switchMap((workspace) =>
          interval(sortingTimeToMs(workspace[0]?.sortingTime)).pipe(
            mapTo(workspace),
          ),
        ),
      )
      .subscribe((workspace) =>
        this.service.initWorkspace(
          workspace.map((w) => w.id),
          false,
        ),
      );
  }

  protected readonly String = String;
  protected readonly getExchangeData = getExchangeData;
}
