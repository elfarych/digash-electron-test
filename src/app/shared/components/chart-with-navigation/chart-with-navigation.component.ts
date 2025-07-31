import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniChartComponent } from '../mini-chart/mini-chart.component';
import { CoinData } from '../../models/CoinData';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { MatRippleModule } from '@angular/material/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { MatButtonModule } from '@angular/material/button';
import { ConvertPricePipe } from '../../pipes/convert-price.pipe';
import { ChartNavigationComponent } from './components/chart-navigation/chart-navigation.component';
import { NavigationSettingsComponent } from './components/navigation-settings/navigation-settings.component';
import { CoinSortingType, SortingId } from '../../models/CoinsSorting';
import { ChartWithNavigationService } from './chart-with-navigation.service';
import {
  combineLatest,
  filter,
  firstValueFrom,
  interval,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { AngularSplitModule, ISplitDirection } from 'angular-split';
import { SortingDirection } from '../../models/Sorting';
import { Preferences } from '../../models/Preferences';
import { Exchange } from '../../models/Exchange';
import { Timeframe } from '../../models/Timeframe';
import { MatIconModule } from '@angular/material/icon';
import { WatchlistCoin, WatchlistColor } from '../../models/Watchlist';
import {
  ChartSettings,
  DensitiesWidgetSettings,
} from '../../models/ChartSettings';
import { Title } from '@angular/platform-browser';
import { Alert } from '../../models/Alert';
import { WatchlistSelectionComponent } from '../watchlist-selection/watchlist-selection.component';
import { ChartNavigationCoinRowComponent } from './components/chart-navigation-coin-row/chart-navigation-coin-row.component';
import { ChartTechnicalIndicators } from '../../models/chart-indicators/ChartIndicators';
import { NightVisionChartComponent } from '../night-vision-chart/night-vision-chart.component';
import { Splitter, SplitterModule } from 'primeng/splitter';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Scroller, ScrollerModule } from 'primeng/scroller';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DataLoaderMode } from '../../types/base.types';
import { ChartLayout, ChartLayoutData } from '../mini-chart/models/ChartLayout';
import { AuthService } from '../../../auth/data-access/auth.service';
import { ButtonModule } from 'primeng/button';
import { BlockUIModule } from 'primeng/blockui';
import { Router } from '@angular/router';
import { UserData } from '../../models/Auth';
import { PrimeIcons } from 'primeng/api';
import { DensitiesWidgetComponent } from '../densities-witget/densities-widget.component';
import { ChartNavigationFromWorkspaceModel } from '../../models/ChartNavigationFromWorkspace.model';
import { Density } from '../../utils/densities';
import { Preset } from '../../models/Preset';
import { ChartMobileNavigationComponent } from './components/chart-mobile-navigation/chart-mobile-navigation.component';

@Component({
  selector: 'app-chart-with-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MiniChartComponent,
    MatRippleModule,
    SvgIconComponent,
    MatButtonModule,
    ConvertPricePipe,
    NavigationSettingsComponent,
    ProgressSpinnerComponent,
    AngularSplitModule,
    MatIconModule,
    WatchlistSelectionComponent,
    ChartNavigationCoinRowComponent,
    NightVisionChartComponent,
    SplitterModule,
    ScrollerModule,
    RippleModule,
    TooltipModule,
    ButtonModule,
    BlockUIModule,
    ChartNavigationComponent,
    DensitiesWidgetComponent,
    ChartMobileNavigationComponent,
  ],
  templateUrl: './chart-with-navigation.component.html',
  styleUrls: ['./chart-with-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartWithNavigationComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input()
  public selectedCoin: string;

  @Input()
  public exchange: Exchange;

  @Input()
  public preferences: Preferences;

  @Input()
  public showDailyHighAndLow: boolean;

  @Input()
  public showLimitOrders: boolean;

  @Input()
  public standaloneChart = false;

  @Input()
  public horizontalLevelsTouches: number;

  @Input()
  public horizontalLevelsTouchesThreshold: number;

  @Input()
  public horizontalLevelsLivingTime: number;

  @Input()
  public showHorizontalLevels: boolean;

  @Input()
  public chartIndicators: ChartTechnicalIndicators[];

  @Input()
  public setPriceTitle: boolean = false;

  @Output()
  public coinChange: EventEmitter<{ symbol: string; exchange: Exchange }> =
    new EventEmitter<{ symbol: string; exchange: Exchange }>();

  @Output()
  public exchangeChange: EventEmitter<{ symbol: string; exchange: Exchange }> =
    new EventEmitter<{ symbol: string; exchange: Exchange }>();

  @ViewChild(Scroller, { static: true })
  public scroller: Scroller;

  @ViewChild(Splitter, { static: true })
  public splitter: Splitter;

  public coinsNavigationAutoSize$: Observable<boolean> =
    this.service.getCoinsNavigationAutoSize();

  public isPremium$: Observable<boolean> =
    this.authService.getPremiumIsActive();
  public coins$: Observable<WorkspaceCoins[]> =
    this.service.selectSortedCoins();
  public allCoins$: Observable<WorkspaceCoins[]> =
    this.service.selectAllCoins();
  public densities$: Observable<Density[]> = this.service.getDensities();
  public presets$: Observable<Preset[]> = this.service.getPresets();
  public selectedPreset$: Observable<Preset> = this.service.getSelectedPreset();
  public userData$: Observable<UserData> = this.authService.getUserData();
  public filteredCoins$: Observable<WorkspaceCoins[]> = combineLatest([
    this.isPremium$,
    this.coins$,
  ]).pipe(
    map(([isPremium, coins]) => {
      if (!isPremium && !this.standaloneChart) {
        return coins.slice(0, 10);
      }
      // if (!isPremium && this.standaloneChart) {
      //   const coinsCopy = JSON.parse(JSON.stringify(coins));
      //   return coinsCopy.sort((a: WorkspaceCoins, b: WorkspaceCoins) => b.data.price_changes.priceChange24h - a.data.price_changes.priceChange24h)
      // }

      return coins;
    }),
  );
  public loading$: Observable<boolean> =
    this.service.getNavigationCoinsLoading();

  public watchlistCoins$: Observable<WatchlistCoin[]> = of([]);
  public navigationColumnIds$: Observable<SortingId[]> =
    this.service.getCoinsNavigationColumnIds();
  public coinsNavigationColumns$: Observable<CoinSortingType[]> =
    this.service.getCoinsNavigationColumns();
  public chartSettings$: Observable<ChartSettings>;
  public sortingDirection$: Observable<SortingDirection> =
    this.service.getCoinsNavigationActiveSortingDirection();
  public activeSortingId$: Observable<SortingId> =
    this.service.getCoinsNavigationActiveSorting();
  public sortByAlerts$: Observable<boolean> =
    this.service.getCoinsNavigationSortByAlerts();
  public splitAreaDirection: ISplitDirection =
    window.innerWidth > 820 ? 'horizontal' : 'vertical';

  public coinData: CoinData;
  public alerts$: Observable<Alert[]> = this.service.getAlerts();

  public dataLoaderMode: DataLoaderMode = 'manual';
  public showPScroller: boolean = true;

  public selectedChardGridId: string;
  public horizontalChartGridData: ChartLayoutData[] = [];
  public verticalChartGridData: ChartLayoutData[] = [];
  public splitterPanelSizes: number[] = [70, 30];
  public coinsNavigationCollapsed: boolean = false;

  public chartLayout: ChartLayout;
  public timeframe: Timeframe;
  public popupFromWorkspace: boolean = false;

  private dataLoaderSubscription: Subscription = new Subscription();
  private subscription: Subscription = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private service: ChartWithNavigationService,
    private titleService: Title,
    private authService: AuthService,
    private router: Router,
    @Optional()
    private dialogRef: DynamicDialogRef,
    @Optional()
    @Inject(DynamicDialogConfig)
    public data?: { data: ChartNavigationFromWorkspaceModel },
  ) {}

  public ngOnDestroy(): void {
    this.titleService.setTitle('Digash');
    this.service.destroyWorkspaceDataUpdate();
    this.subscription.unsubscribe();
    this.dataLoaderUnsubscribe();
    this.service.destroy();
  }

  public ngOnInit(): void {
    this.setSplitPanelSizes();
    this.service.loadPresets();
    if (this.data?.data?.dialog) {
      const { data } = this.data;
      this.selectedCoin = data?.coin;
      this.coinData = data?.coinData;
      this.preferences = data?.preferences;
      this.exchange = data?.exchange;
      this.timeframe = data?.timeframe;
      this.showLimitOrders = data?.showLimitOrders;
      this.showDailyHighAndLow = data?.showDailyHighAndLow;
      this.horizontalLevelsTouches = data?.horizontalLevelsTouches;
      this.horizontalLevelsTouchesThreshold =
        data?.horizontalLevelsTouchesThreshold;
      this.horizontalLevelsLivingTime = data?.horizontalLevelsLivingTime;
      this.showHorizontalLevels = data?.showHorizontalLevels;
      this.chartSettings$ = of(data?.workspace);
      this.chartIndicators = data?.chartIndicators;
      this.popupFromWorkspace = true;

      this.service.loadCoinsNavigationFromWorkspace(data);
    } else {
      this.chartSettings$ = this.service.getNavigationCoinsChartSettings();
      this.service.loadCoinsNavigationData(this.exchange, false);
      this.service.loadCoinsNavigationSettings();
    }

    // this.service.setupWorkspaceDataUpdate(this.exchange, this.userData$);
    this.dataLoaderSubscribe();
    this.watchlistCoins$ = this.service.getWatchlistCoins(this.exchange);

    this.subscription.add(
      this.coins$
        .pipe(filter((coins) => !!coins.length))
        .subscribe(() => this.getCoinData()),
    );

    this.setColumnsChangeHandler();

    this.subscription.add(
      this.coinsNavigationAutoSize$.subscribe(async (value) => {
        if (value) {
          const columns = await firstValueFrom(this.coinsNavigationColumns$);
          await this.setNavigationPanelSize(columns);
        }
      }),
    );

    this.subscription.add(
      this.selectedPreset$.subscribe(async (value) => {
        if (value) {
          const columns = await firstValueFrom(this.coinsNavigationColumns$);
          await this.setNavigationPanelSize(columns, true);
        }
      }),
    );

    this.subscription.add(
      this.chartSettings$.subscribe((value) => {
        if (this.exchange !== value.market) {
          this.exchangeChange.emit({
            symbol: this.selectedCoin,
            exchange: value.market,
          });
        }
      }),
    );

    this.handleSelectChartLayout(this.preferences.chartLayout);
  }

  public ngOnChanges({ selectedCoin, exchange }: SimpleChanges): void {
    if (selectedCoin || exchange) {
      this.getCoinData();
      // this.titleService.setTitle(`${this.selectedCoin} - ${this.timeframe}`);
    }

    if (exchange && !exchange.isFirstChange()) {
      this.service.loadCoinsNavigationData(this.exchange, false);
      // this.service.setupWorkspaceDataUpdate(this.exchange, this.userData$);
      this.watchlistCoins$ = this.service.getWatchlistCoins(this.exchange);
    }

    // if (preferences) {
    //   this.handleSelectChartLayout();
    // }
  }

  public get isDesktop(): boolean {
    return window.innerWidth > 992;
  }

  public async swapCoinExchange(data: {
    symbol: string;
    exchange: Exchange;
  }): Promise<void> {
    this.coinChange.emit({
      symbol: data.symbol,
      exchange: data.exchange,
    });
    // const chartSettings = await firstValueFrom(this.chartSettings$);
    // this.chartSettingsChange({ ...chartSettings, market: data.exchange });
  }

  public async selectTechnicalIndicator(
    indicators: ChartTechnicalIndicators[],
  ): Promise<void> {
    const chartSettings: ChartSettings = await firstValueFrom(
      this.chartSettings$,
    );

    this.service.updateChartSettings({
      ...chartSettings,
      technicalIndicators: indicators,
    });
  }

  public excludeExchanges(exchanges: Exchange[]): void {
    this.service.excludeExchanges(exchanges);
  }

  public redirectToPremium(): void {
    this.router.navigate(['app', 'premium']);
    this.dialogRef.close();
  }

  public selectedChartGridIdChange(id: string): void {
    this.selectedChardGridId = id;
    let chart;

    if (this.preferences.chartLayout === 'horizontal') {
      chart = this.horizontalChartGridData.find((chart) => chart.id === id);
    } else if (this.preferences.chartLayout === 'vertical') {
      chart = this.verticalChartGridData.find((chart) => chart.id === id);
    } else if (this.preferences.chartLayout === 'combined') {
      chart = [
        ...this.verticalChartGridData,
        ...this.horizontalChartGridData,
      ].find((chart) => chart.id === id);
    }

    if (chart) {
      this.timeframe = chart.timeframe;
    }
  }

  public async changeInterval(interval: Timeframe): Promise<void> {
    const chartSettings = await firstValueFrom(this.chartSettings$);
    this.timeframe = interval;
    if (this.preferences.chartLayout !== 'single') {
      let chartGridTimeFrames: { [key: string]: Timeframe } = {};
      if (chartSettings.chartGridTimeFrames) {
        chartGridTimeFrames = JSON.parse(
          JSON.stringify(chartSettings?.chartGridTimeFrames ?? {}),
        );
      }

      const horizontalIdx = this.horizontalChartGridData.findIndex(
        (chartGridData) => chartGridData.id === this.selectedChardGridId,
      );
      const verticalIdx = this.verticalChartGridData.findIndex(
        (chartGridData) => chartGridData.id === this.selectedChardGridId,
      );

      if (horizontalIdx !== -1) {
        this.horizontalChartGridData = [
          ...this.horizontalChartGridData.slice(0, horizontalIdx),
          {
            ...this.horizontalChartGridData[horizontalIdx],
            timeframe: interval,
          },
          ...this.horizontalChartGridData.slice(horizontalIdx + 1),
        ];
      }

      if (verticalIdx !== -1) {
        this.verticalChartGridData = [
          ...this.verticalChartGridData.slice(0, verticalIdx),
          {
            ...this.verticalChartGridData[verticalIdx],
            timeframe: interval,
          },
          ...this.verticalChartGridData.slice(verticalIdx + 1),
        ];
      }

      [...this.verticalChartGridData, ...this.horizontalChartGridData].forEach(
        (d) => {
          chartGridTimeFrames[d.id] = d.timeframe;
        },
      );
      if (!this.data?.data?.dialog) {
        this.chartSettingsChange({ ...chartSettings, chartGridTimeFrames });
      }
    } else {
      if (!this.data?.data?.dialog) {
        this.chartSettingsChange({ ...chartSettings, timeframe: interval });
      }
    }
  }

  public getWatchlistCoin(
    watchlistCoins: WatchlistCoin[],
    symbol: string,
  ): WatchlistCoin {
    return watchlistCoins.find((coin: WatchlistCoin) => coin.symbol === symbol);
  }

  public handleSelectColor({ color, symbol }): void {
    this.service.changeWatchlistSymbolColor(
      symbol,
      this.exchange,
      color as WatchlistColor,
    );
  }

  public async updateChartLayout(layout: ChartLayout): Promise<void> {
    this.handleSelectChartLayout(layout);
    await this.service.updateChartLayout(layout);
  }

  public async handleSelectChartLayout(layout: ChartLayout): Promise<void> {
    const chartSettings = await firstValueFrom(this.chartSettings$);
    this.chartLayout = layout;
    this.selectedChardGridId = undefined;
    this.verticalChartGridData = [];
    this.horizontalChartGridData = [];

    switch (layout) {
      case 'vertical':
        this.verticalChartGridData = [
          {
            id: 'vertical1',
            timeframe:
              chartSettings.chartGridTimeFrames?.['vertical1'] ??
              chartSettings.timeframe,
          },
          {
            id: 'vertical2',
            timeframe:
              chartSettings.chartGridTimeFrames?.['vertical2'] ??
              (chartSettings.timeframe === '5m' ? '15m' : '5m'),
          },
        ];
        break;
      case 'horizontal':
        this.horizontalChartGridData = [
          {
            id: 'horizontal1',
            timeframe:
              chartSettings.chartGridTimeFrames?.['horizontal1'] ??
              chartSettings.timeframe,
          },
          {
            id: 'horizontal2',
            timeframe:
              chartSettings.chartGridTimeFrames?.['horizontal2'] ??
              (chartSettings.timeframe === '5m' ? '15m' : '5m'),
          },
        ];
        break;
      case 'combined':
        this.verticalChartGridData = [
          {
            id: 'combined3',
            timeframe: chartSettings.chartGridTimeFrames?.['combined3'] ?? '5m',
          },
          {
            id: 'combined2',
            timeframe: chartSettings.chartGridTimeFrames?.['combined2'] ?? '4h',
          },
        ];
        this.horizontalChartGridData = [
          {
            id: 'combined1',
            timeframe: chartSettings.chartGridTimeFrames?.['combined1'] ?? '1m',
          },
          {
            id: 'combined4',
            timeframe:
              chartSettings.chartGridTimeFrames?.['combined4'] ?? '15m',
          },
        ];
        break;
    }
  }

  public isInWatchlist(
    watchlistCoins: WatchlistCoin[],
    symbol: string,
  ): boolean {
    return !!watchlistCoins.find(
      (coin: WatchlistCoin) => coin.symbol === symbol,
    );
  }

  public toggleWatchlist(event: MouseEvent, symbol: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.service.toggleWatchlist(symbol, this.exchange);
  }

  public showSortingByAlerts(columns: CoinSortingType[]): boolean {
    return !!columns.find((c) => c.id === 'Alert');
  }

  public showSortingByWatchlist(columns: CoinSortingType[]): boolean {
    return !!columns.find((c) => c.id === 'Watchlist');
  }

  public getColumnsCount(columns: CoinSortingType[]): number {
    return (
      columns.filter((c) => !['Alert', 'Watchlist'].includes(c.id)).length + 1
    );
  }

  public async updateDensitiesWidgetSettings(
    widgetSettings: DensitiesWidgetSettings,
  ): Promise<void> {
    const chartSettings = await firstValueFrom(this.chartSettings$);
    this.chartSettingsChange({
      ...chartSettings,
      densitiesWidgetSettings: widgetSettings,
    });
  }

  public async selectDensity(density: Density): Promise<void> {
    const coins = await firstValueFrom(this.allCoins$);
    const coin = coins.find((c) => c.symbol == density.symbol);
    if (coin) {
      this.selectCoin(coin);
    }
  }

  public selectCoin(coin: WorkspaceCoins): void {
    if (!this.data?.data?.dialog) {
      this.selectedCoin = coin.symbol;
      this.coinData = coin.data;
      this.cdr.detectChanges();
    }

    this.selectedCoin = coin.symbol;
    this.coinData = coin.data;
    this.coinChange.emit({
      symbol: this.selectedCoin,
      exchange: this.exchange,
    });
    this.cdr.detectChanges();
  }

  @HostListener('document:keydown.space', ['$event'])
  @HostListener('document:keydown.arrowdown', ['$event'])
  public async handleNavigationDown(event: KeyboardEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const coins = await firstValueFrom(this.coins$);

    const selectedSymbolIdx = coins.findIndex(
      (symbol) => symbol.symbol === this.selectedCoin,
    );
    const coin: WorkspaceCoins = coins[selectedSymbolIdx + 1]
      ? coins[selectedSymbolIdx + 1]
      : coins[selectedSymbolIdx];
    this.selectCoin(coin);
  }

  @HostListener('document:keydown.arrowup', ['$event'])
  public async handleNavigationUp(event: KeyboardEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const coins = await firstValueFrom(this.coins$);

    const selectedSymbolIdx = coins.findIndex(
      (symbol) => symbol.symbol === this.selectedCoin,
    );
    const coin: WorkspaceCoins = coins[selectedSymbolIdx - 1]
      ? coins[selectedSymbolIdx - 1]
      : coins[selectedSymbolIdx];
    this.selectCoin(coin);
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent): void {
    const key: string = event.key;
    const intervalKeyMap: { [key: string]: Timeframe } = {
      '1': '1m',
      '2': '5m',
      '3': '15m',
      '4': '1h',
      '5': '4h',
      '6': '1d',
    };

    if (key in intervalKeyMap) {
      this.changeInterval(intervalKeyMap[key]);
    }

    if (event.shiftKey && key.toLowerCase() === 'r') {
      this.dataLoadButtonClick();
    }

    if (event.shiftKey && key.toLowerCase() === 'r') {
      this.dataLoadButtonClick();
    }
  }

  public columnSelectionChange(id: SortingId): void {
    this.service.toggleColumn(id);
  }

  public chartSettingsChange(chartSettings: ChartSettings): void {
    const exchange = chartSettings.market ?? this.exchange;
    this.service.updateChartSettings({ ...chartSettings, market: exchange });

    const symbol = this.selectedCoin;
    // if (
    //   (exchange.includes('BINANCE') || exchange.includes('BYBIT'),
    //   exchange.includes('BITGET'))
    // ) {
    //   symbol = normalizeCoinQuoteSymbol(this.selectedCoin);
    // }

    this.exchangeChange.emit({ symbol, exchange });
  }

  public async closeDensitiesWidget(): Promise<void> {
    const chartSettings = await firstValueFrom(this.chartSettings$);
    this.chartSettingsChange({ ...chartSettings, showDensitiesWidget: false });
  }

  public updateSorting(id: SortingId): void {
    this.service.updateSorting(id);
  }

  public toggleSortingByAlerts(): void {
    this.service.toggleSortingByAlerts();
  }

  public toggleNavigationAutoSize(): void {
    this.service.toggleNavigationAutoSize();
  }

  public switchDataLoaderMode(mode: DataLoaderMode): void {
    // this.dataLoaderMode = mode;
    // if (mode === 'auto') {
    //   this.dataLoaderSubscribe();
    // } else {
    //   this.dataLoaderUnsubscribe();
    // }
  }

  public dataLoadButtonClick(): void {
    if (this.dataLoaderMode === 'manual') {
      this.service.loadCoinsNavigationData(this.exchange);
    }
  }

  public async onSplitAreaResizeEnd(data: {
    sizes: [number, number];
  }): Promise<void> {
    const isCoinsNavigationAutoSize = await firstValueFrom(
      this.coinsNavigationAutoSize$,
    );
    localStorage.setItem('splitAreaPanelSizes', JSON.stringify(data.sizes));

    if (isCoinsNavigationAutoSize) {
      this.toggleNavigationAutoSize();
    }

    if (window.innerWidth > 820) return;
    this.showPScroller = true;
  }

  public onSplitAreaResizeStart(): void {
    if (window.innerWidth > 820) return;
    this.showPScroller = false;
  }

  public toggleCollapseCoinsNavigation(): void {
    this.coinsNavigationCollapsed = !this.coinsNavigationCollapsed;

    if (this.coinsNavigationCollapsed) {
      this.splitterPanelSizes = [100, 0.01];
    } else {
      this.setSplitPanelSizes();
    }

    this.cdr.detectChanges();
  }

  public resetNavigationColumns(): void {
    this.service.resetNavigationColumns();
  }

  public createPreset(data: Partial<Preset>): void {
    this.service.createPreset(data);
  }

  public selectPreset(preset: Preset): void {
    this.service.selectPreset(preset);
  }

  public editPreset(preset: Preset): void {
    this.service.editPreset(preset);
  }

  public deletePreset(id: number): void {
    this.service.deletePreset(id);
  }

  private async getCoinData(): Promise<void> {
    if (this.data?.data?.dialog) {
      return void 0;
    }
    const coins = await firstValueFrom(this.coins$);
    this.coinData = coins.find(
      (value: WorkspaceCoins) => value.symbol === this.selectedCoin,
    )?.data;
  }

  private dataLoaderSubscribe() {
    this.dataLoaderSubscription.add(
      interval(60_000).subscribe(() =>
        this.service.loadCoinsNavigationData(
          this.exchange,
          true,
          true,
          false,
          false,
        ),
      ),
    );
  }

  private dataLoaderUnsubscribe(): void {
    if (this.dataLoaderSubscription) {
      this.dataLoaderSubscription.unsubscribe();
      this.dataLoaderSubscription = new Subscription();
    }
  }

  private setSplitPanelSizes(): void {
    const localSplitAreaLayout = localStorage.getItem('splitAreaPanelSizes');
    if (localSplitAreaLayout) {
      const sizes = JSON.parse(localSplitAreaLayout);

      if (sizes[1] < 5) {
        sizes[1] = 5;
      }
      this.splitterPanelSizes = sizes;
    } else {
      this.splitterPanelSizes = [70, 30];
    }
  }

  private setColumnsChangeHandler(): void {
    this.subscription.add(
      this.coinsNavigationColumns$.subscribe((columns) => {
        this.setNavigationPanelSize(columns);
      }),
    );
  }

  private async setNavigationPanelSize(
    columns: CoinSortingType[],
    ignoreAutoSize = false,
  ): Promise<void> {
    if (this.coinsNavigationCollapsed) {
      return void 0;
    }

    const isNavigationAutoSize = await firstValueFrom(
      this.service.getCoinsNavigationAutoSize(),
    );
    const windowWith = window.innerWidth;

    if ((!isNavigationAutoSize && ignoreAutoSize) || windowWith < 992) {
      return void 0;
    }
    const columnsSize = this.getColumnsSize(columns);

    const chartPercent = ((windowWith - columnsSize) / windowWith) * 100;
    const panelPercent = (columnsSize / windowWith) * 100;
    this.splitterPanelSizes = [chartPercent, panelPercent];

    localStorage.setItem(
      'splitAreaPanelSizes',
      JSON.stringify(this.splitterPanelSizes),
    );
  }

  private getColumnsSize(columns: CoinSortingType[]): number {
    let size = 104;
    columns.forEach((c) => {
      if (c.id === 'Watchlist' || c.id === 'Alert') {
        size += 25 + 4;
      } else {
        size += 90 + 4;
      }
    });

    return size;
  }

  protected readonly interval = interval;
  protected readonly PrimeIcons = PrimeIcons;
}
