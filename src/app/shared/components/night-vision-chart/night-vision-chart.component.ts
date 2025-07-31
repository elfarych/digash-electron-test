import { UserTradesProcessedData } from '../../api/user-trades-data/user-trades-data.models';
import {
  defaultUserTradesIndicatorProps,
  UserTradesIndicatorProps,
} from '../../models/chart-indicators/UserTrades';
import { getCandleTimeInMs } from '../../utils/candleTimeInMs';
import { calculateUserTradesData } from '../../utils/scripts/calculateUserTrades';
// @ts-ignore
import SIGNAL_LEVEL_NAVY from './scripts/SignalLevel.navy';
// @ts-ignore
import HORIZONTAL_LEVEL_NAVY from './scripts/HorizontalLevels.navy';
// @ts-ignore
import TREND_LEVEL_NAVY from './scripts/TrendLevels.navy';
// @ts-ignore
import COIN_DATA_NAVY from './scripts/CoinData.navy';
// @ts-ignore
import CANDLES from './scripts/Candles.navy';
// @ts-ignore
import LIMIT_ORDER_LEVEL_NAVY from './scripts/LimitOrdersLevels.navy';
// @ts-ignore
import DAILY_LOW_HIGH_NAVY from './scripts/HighLowsLevels.navy';
// @ts-ignore
import BUBBLES_NAVY from './scripts/Bubbles.navy';
// @ts-ignore
import NOTIFICATIONS_STORY_NAVY from './scripts/NotificationsStory.navy';
// @ts-ignore
import USER_TRADES from './scripts/UserTrades.navy';
// @ts-ignore
import BARS_NAVY from './scripts/Bars.navy';
// @ts-ignore
import SESSION_ZONES_NAVY from './scripts/SessionZones.navy';
// @ts-ignore
import SPLINE_NAVY from './scripts/Spline.navy';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CandlestickIntervals,
  CandlestickVisualization,
} from '../../models/Candlestick';
import { NightVision } from 'night-vision';
import { firstValueFrom, Observable, Subscription, takeUntil } from 'rxjs';
// @ts-ignore
import { Subject } from 'rxjs/internal/Subject';
import { Exchange, getExchangeData } from '../../models/Exchange';
import { ChartType } from '../../models/ChartType';
import { roundDate } from '../../utils/roundDate';

import { NightVisionChartService } from './night-vision-chart.service';
import { Title } from '@angular/platform-browser';
import { AppTheme, UserData } from '../../models/Auth';
import { AuthService } from '../../../auth/data-access/auth.service';
import {
  BaseDrawingTool,
  DrawingTool,
  DrawingToolType,
  getDrawingOverlays,
  LineDrawingTool,
} from '../../models/DrawingTool';
import { getChartThemeColors } from './util/getChartThemeColors';
import { getChartDataByChartType } from './util/getChartDataByChartType';
import { Overlay, OverlayData, Pane } from 'night-vision/dist/types';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { ChartSettings } from '../../models/ChartSettings';
import { convertCandlesToHorizontalLevelsOverlay } from '../../utils/scripts/convertCandlesToHorizontalLevelsOverlay';
import { CoinData } from '../../models/CoinData';
import { convertCandlesToTrendlineLevelsOverlay } from '../../utils/scripts/convertCandlesToTrendlineLevelsOverlay';
import { convertCandlesToLimitOrdersOverlay } from '../../utils/scripts/convertCandlesToLimitOrdersOverlay';
import { Alert } from '../../models/Alert';
import { Preferences } from '../../models/Preferences';
import { ClickedPriceLevelRemoveEvent } from '../mini-chart/models/ClickedPriceLevelRemoveEvent';
import { AlertsService } from '../../store/alerts/alerts.service';
import { MovedPriceLevelEvent } from '../../models/MovedPriceLevelEvent';
import { calculateLimitOrders } from '../../utils/scripts/calculateLimitOrders';
import {
  defaultCoinDataProps,
  getTextColor,
} from '../../models/chart-indicators/CoinData';
import { calculateHorizontalLevels } from '../../utils/calculateHorizontalLevels';
import { ButtonModule } from 'primeng/button';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import {
  ChartOverlayLevel,
  getLimitOrderTooltipData,
  LimitOrderTooltipData,
} from './util/getLimitOrderTooltipData';
import { ClickedLimitOrderEvent } from '../mini-chart/models/ClickedLimitOrderEvent';
import { PremiumForbiddenDialogService } from '../premium-forbidden-dialog/premium-forbidden-dialog.service';
import { Router } from '@angular/router';
import {
  AppCustomEvent,
  AppEventService,
} from '../../../core/events/event.service';
import { Timeframe } from '../../models/Timeframe';
import { calculateDailyHighLows } from '../../utils/scripts/calculateDailyHighLows';
import { convertDailyHighLowsOverlay } from '../../utils/scripts/convertDailyHighLowsOverlay';
import {
  calculateCandleCount,
  calculateTimeRange,
} from './util/calculateCandlesCount';
import { ChartDrawingToolsData, ChartRangeUpdateData } from './util/models';
import { isExchangeFutures } from '../../utils/isExchangeFutures';
import { getPrecision } from '../../utils/getPrecision';
import { convertTechnicalIndicatorToOverlay } from '../../utils/scripts/convertTechnicalIndicatorToOverlay';
import { mainOverlays } from './util/mainOverlays';
import { convertTechnicalIndicatorToPane } from '../../utils/scripts/convertTechnicalIndicatorToPane';
import { OpenInterest } from '../../models/OpenInterest';
import { scriptsCalculator } from '../../utils/scripts/scriptsCalculator';
import { ChartIndicatorsProps } from '../../models/chart-indicators/ChartIndicatorsProps';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SymbolPipe } from '../../pipes/symbol.pipe';
import { ChartDrawingToolConfigurationComponent } from '../chart-drawing-tool-configuration/chart-drawing-tool-configuration.component';
import { initialPreferencesState } from '../preferences/data-access/preferences.reducer';
import { CoinDataQuestionEvent } from '../mini-chart/models/CoinDataQuestionEvent';
import { AlertNotification } from '../../models/Notification';
import { Liquidation } from '../../utils/Liquidation';
import { ChartTechnicalIndicators } from '../../models/chart-indicators/ChartIndicators';
import { convertPriceLevelToOverlay } from '../../utils/scripts/convertPriceLevelToOverlay';
import { getChartType } from './util/getChartType';

@Component({
  selector: 'night-vision-chart',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerComponent,
    OverlayPanelModule,
    ToastModule,
    SymbolPipe,
    ChartDrawingToolConfigurationComponent,
  ],
  templateUrl: './night-vision-chart.component.html',
  styleUrls: ['./night-vision-chart.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NightVisionChartComponent implements OnInit, OnChanges {
  @Input()
  public id: string;

  @Input()
  public symbol: string;

  @Input()
  public timeframe: CandlestickIntervals;

  @Input()
  public exchange: Exchange = 'BINANCE_SPOT';

  @Input()
  public selectedChartType: ChartType = 'candlestick';

  @Input()
  public notifications: AlertNotification[] = [];

  @Input()
  public chartSettings: ChartSettings;

  @Input()
  public coinData: CoinData;

  @Input()
  public coinAlerts: Alert[] = [];

  @Input()
  public preferences: Preferences;

  @Input()
  public fullChart: boolean;

  @Input()
  public selectedChartId: string;

  @Input()
  public chartId: string;

  @Input()
  public isAuth: boolean;

  @Input()
  public premium: boolean;

  @Input()
  public technicalIndicators: ChartTechnicalIndicators[] = [];

  @Input()
  public chartInOverlay: boolean = false;

  @Input()
  public fixHeight: boolean = false;

  @Input()
  public setPriceTitle: boolean = false;

  @Input()
  public isMainChart: boolean = true;

  @Output()
  public candlesLenUpdated: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public chartIndicatorsChange: EventEmitter<ChartTechnicalIndicators[]> =
    new EventEmitter<ChartTechnicalIndicators[]>();

  @Output()
  public drawingToolChange: EventEmitter<DrawingToolType> =
    new EventEmitter<DrawingToolType>();

  @ViewChild('candlestickRef', { static: false })
  public candlestickRef: ElementRef<HTMLElement>;

  @ViewChild('limitOrderTooltip', { static: true })
  public limitOrderTooltip: OverlayPanel;

  @ViewChild('coinDataTooltip', { static: true })
  public coinDataTooltip: OverlayPanel;

  public displayProgressSpinner = true;
  public containerHeight: number;
  public klinesLoading = false;
  public showChart = false;
  public selectedDrawingTool: DrawingTool = undefined;
  public priceCrossingAlerts$: Observable<Alert[]>;
  public errorMessage: string;
  public limitOrderTooltipHtml: string;
  public coinDataTooltipHtml: string;

  @HostBinding('class.active')
  public active = false;

  private theme$: Observable<AppTheme> = this.authService.getApplicationTheme();
  private user$: Observable<UserData> = this.authService.getUserData();
  private chart: NightVision;
  private width: number;
  private height: number;
  private destroyed$: Subject<void> = new Subject();
  private tradesDestroyed$: Subject<void> = new Subject();
  private candlesData = [];
  private drawingTools: DrawingTool[] = [];
  private candlestickSubscription$: Subscription;
  private chunkLoaded = 0;
  private chunkStep = 500;
  private priceCrossingAlertsSubscription$: Subscription;
  private appEventSubscription: Subscription;
  private userSubscription: Subscription;
  private userData: UserData;
  private preventChartRangeUpdate: boolean = false;
  private preventChartRangeUpdateTimeout: number = 0;
  private chartSyncKeyPressed = false; // Alt
  private openInterestData: OpenInterest[] = [];
  private userTrades: UserTradesProcessedData[] = [];

  private userTradesSubscription$: Subscription = new Subscription();
  private levelsUpdateInterval: number | null = null;
  private liquidationsData: { [tick: string]: Liquidation } = {};

  constructor(
    private element: ElementRef,
    private service: NightVisionChartService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private authService: AuthService,
    private premiumForbiddenDialogService: PremiumForbiddenDialogService,
    private alertsService: AlertsService,
    private router: Router,
    private appEventService: AppEventService,
    private translateService: TranslateService,
    private messageService: MessageService,
  ) {}

  public ngOnInit(): void {
    setTimeout(() => {
      this.width = this.element.nativeElement.offsetWidth;
      this.height = this.element.nativeElement.offsetHeight;
      this.containerHeight = this.element.nativeElement.offsetHeight;
      this.draw();
    });

    this.levelsUpdateInterval = setInterval(() => {
      this.updateHorizontalLevelsData();
    }, 20_000);

    this.appEventSubscription = this.appEventService.event$.subscribe(
      (event: AppCustomEvent) => {
        const eventData = event.data as ChartDrawingToolsData;
        if (
          event.name === 'chart:drawing-tools-updated' &&
          eventData.symbol === this.symbol &&
          eventData.exchange === this.exchange
        ) {
          this.toggleDrawingTools(
            event.data as { data: DrawingTool[]; timeframe: Timeframe },
          );
        }

        if (event.name === 'chart:range-updated') {
          if (this.preventChartRangeUpdateTimeout) {
            clearTimeout(this.preventChartRangeUpdateTimeout);
          }

          this.preventChartRangeUpdate = true;
          const eventData: ChartRangeUpdateData =
            event.data as ChartRangeUpdateData;

          if (
            this.symbol !== eventData.initiatorSymbol &&
            this.chart.range[0] !== eventData.range[0] &&
            this.timeframe === eventData.timeframe
          ) {
            this.chart.range = eventData.range;

            this.candlesLenUpdated.emit(eventData.candlesLength);

            this.preventChartRangeUpdateTimeout = setTimeout(() => {
              this.preventChartRangeUpdate = false;
            }, 5_000);
          }
        }
      },
    );

    this.userSubscription = this.user$.subscribe(
      (user) => (this.userData = user),
    );

    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
    this.service.loadDrawingTools();
  }

  public async ngOnChanges({
    symbol,
    exchange,
    timeframe,
    chartSettings,
    coinData,
    preferences,
    chartId,
    selectedChartId,
    technicalIndicators,
    notifications,
  }: SimpleChanges): Promise<void> {
    if (chartId || selectedChartId) {
      this.active = this.chartId && this.selectedChartId === this.chartId;
    }

    if (notifications && !notifications.isFirstChange() && this.chart) {
      this.updateNotificationsPane();
    }

    if (this.candlesData?.length) {
      this.service.setSelectedChartCurrentPriceUpdate(
        this.candlesData[this.candlesData.length - 1][3],
      );
    }

    if (symbol && !symbol.isFirstChange()) {
      this.destroyDataStreaming();
      this.clearChartData();

      await this.draw();
      this.technicalIndicatorsPanesAndOverlays();

      this.service.destroy(
        symbol.previousValue,
        this.exchange,
        this.timeframe,
        this.id,
      );
    }

    if (exchange && !exchange.isFirstChange()) {
      this.destroyDataStreaming();
      this.clearChartData();

      await this.draw();
      this.technicalIndicatorsPanesAndOverlays();
    }

    if (timeframe && !timeframe.isFirstChange()) {
      this.draw(true);
    }

    if (preferences && !preferences.isFirstChange()) {
      this.draw(false, true);
      this.updateChartSettings();
    }

    if (chartSettings && !chartSettings.isFirstChange()) {
      const currentValueTmp = JSON.parse(
        JSON.stringify(chartSettings.currentValue),
      );
      const prevValueTmp = JSON.parse(
        JSON.stringify(chartSettings.previousValue),
      );

      delete currentValueTmp.candlesLength;
      delete prevValueTmp.candlesLength;

      if (JSON.stringify(currentValueTmp) !== JSON.stringify(prevValueTmp)) {
        this.toggleHorizontalLevels();
        this.toggleTrendLevels();
        this.toggleLimitOrders();
        this.toggleDailyHighLowsData();
        this.updateLimitOrdersData();
        this.updateHorizontalLevelsData();
        this.updateDailyHighLowsData();
        this.updateCoinsData();
      }

      if (
        !this.preventChartRangeUpdate &&
        chartSettings.previousValue.candlesLength !==
          chartSettings.currentValue.candlesLength
      ) {
        if (
          this.chart &&
          this.chart.range &&
          chartSettings.currentValue.candlesLength >= 50 &&
          chartSettings.currentValue.candlesLength <= 1000
        ) {
          const newRange = calculateTimeRange(
            chartSettings.currentValue.candlesLength,
            this.timeframe,
          );
          if (this.chart.range[0] !== newRange[0]) {
            this.chart.range = newRange;
          }
        }

        this.setChartOffset();
      }

      if (
        chartSettings.previousValue.chartOffset !==
        chartSettings.currentValue.chartOffset
      ) {
        this.setChartOffset();
      }
    }

    if (coinData) {
      if (
        JSON.stringify(coinData.previousValue) !== JSON.stringify(this.coinData)
      ) {
        this.updateLimitOrdersData();
        this.updateCoinsData();
      }
    }

    if (coinData) {
      if (this.chartSettings.horizontalLevelsTimeframes?.length) {
        this.updateHorizontalLevelsData();
      }
    }

    if (
      technicalIndicators &&
      !technicalIndicators.isFirstChange() &&
      this.chart
    ) {
      this.technicalIndicatorsPanesAndOverlays();
      this.toggleHorizontalLevels();
      this.toggleTrendLevels();
      this.toggleLimitOrders();
      this.toggleDailyHighLowsData();
    }
  }

  public ngOnDestroy(): void {
    this.destroyDataStreaming();

    this.service.destroy(this.symbol, this.exchange, this.timeframe, this.id);

    this.titleService.setTitle('digash');
    this.appEventSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();

    if (this.levelsUpdateInterval) {
      clearInterval(this.levelsUpdateInterval);
    }

    window.removeEventListener('keydown', this.onKeyDown.bind(this));
    window.removeEventListener('keyup', this.onKeyUp.bind(this));
  }

  public removeDrawingTool(drawingTool: BaseDrawingTool): void {
    (this.chart.meta as any).removeTool(drawingTool.uuid);
    this.chart.update('grid', { resetRange: false });
  }

  public redirectToPremium(): void {
    this.router.navigate(['app', 'premium']);
  }

  public getChart(): NightVision {
    return this.chart;
  }

  public setupDataStreaming(): void {
    const exchange: Exchange = Array.isArray(this.exchange)
      ? this.exchange[0]
      : this.exchange;
    this.service.setupCandlestickDataStreaming(
      this.symbol,
      exchange,
      this.timeframe,
      this.id,
    );

    this.candlestickSubscription$?.unsubscribe();

    this.candlestickSubscription$ = this.service
      .getCandlestickDataStreamUpdate(
        this.symbol,
        exchange,
        this.timeframe,
        this.id,
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: CandlestickVisualization) => {
        if (this.setPriceTitle) {
          this.titleService.setTitle(
            `${this.symbol.replace('USDT', '')} ${getExchangeData(this.exchange).market}. - ${this.timeframe} | ${data.close}$`,
          );
        }

        return this.updateCandlestickData(data);
      });
  }

  public handleRightClick(event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  public async loadTrades(): Promise<void> {
    const shouldLoad = this.technicalIndicators?.some((value) =>
      ['UserTrades'].includes(value.name),
    );

    if (!shouldLoad) {
      return void 0;
    }

    await this.loadUserTradesSnapshotData();
    this.setupUserTradesStream();
  }

  @HostListener('document:signal-level-remove', ['$event'])
  public handlePriceLevelRemove(event: ClickedPriceLevelRemoveEvent): void {
    this.alertsService.remove(event.detail.alertId);
  }

  @HostListener('document:signal-level-changed', ['$event'])
  public handlePriceLevelMove(event: MovedPriceLevelEvent): void {
    this.alertsService.movePriceLevelAlert(event.detail);
  }

  @HostListener('window:click', ['$event'])
  public copyTickerShortcut(event: MouseEvent) {
    if (!event.ctrlKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    navigator.clipboard.writeText(this.symbol);
  }

  @HostListener('document:coin-chart-dialog-closed', ['$event'])
  public async updateDrawingTools(event: CustomEvent<string>) {
    if (this.symbol === event.detail) {
      this.draw();
    }
  }

  @HostListener('coin-data-question', ['$event'])
  public async handleCoinDataQuestion(
    event: CoinDataQuestionEvent,
  ): Promise<void> {
    // const userData = await firstValueFrom(this.user$);
    // if (!userData.premium_enabled) {
    //   this.premiumForbiddenDialogService.open(this.translateService.instant('chart.funding_question'));
    //   return void 0;
    // }

    this.coinDataTooltipHtml = '';

    const position = {
      x: (event.detail as any).x,
      y: (event.detail as any).y,
    };

    if (event.detail.type === 'funding') {
      const data = this.coinData.funding;

      const targetTime = data.nextFundingTime;
      const now = Date.now();
      const diffMs = targetTime - now;
      const totalMinutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;

      this.coinDataTooltipHtml += `${this.translateService.instant('chart.funding_info_1')}<br><br>`;
      this.coinDataTooltipHtml += `${this.translateService.instant('chart.funding_info_3')}<br>`;
      this.coinDataTooltipHtml += `${this.translateService.instant('chart.funding_info_4')}<br><br>`;
      this.coinDataTooltipHtml += `${this.translateService.instant('chart.funding_info_2', { funding: data.fundingRate })}<br>`;
      this.coinDataTooltipHtml += `${this.translateService.instant('chart.funding_info_5', { hours, mins })}`;
    }

    const mouseEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: position.x,
      clientY: position.y,
    });

    setTimeout(() => {
      this.coinDataTooltip.show(
        mouseEvent,
        this.getTooltipElement(position.x, position.y),
      );
    });
  }

  @HostListener('document:visibilitychange', [])
  onVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.draw();
    }
  }

  @HostListener('limit-order-clicked', ['$event'])
  public async handleLimitOrderClicked(
    event: ClickedLimitOrderEvent,
  ): Promise<void> {
    const userData = await firstValueFrom(this.user$);
    if (!userData.premium_enabled) {
      this.premiumForbiddenDialogService.open(
        'Подсказки к плотностям открываются в премиум доступе',
      );
      return void 0;
    }

    this.limitOrderTooltipHtml = '';

    const position = {
      x: (event.detail as any).x,
      y: (event.detail as any).y,
    };

    const idx = this.chart.data.panes[0].overlays.findIndex(
      (overlay) => overlay.type === 'HorizontalLevels',
    );
    const levels = this.chart.data?.panes[0]?.overlays[idx]?.data ?? [];

    const limitOrderTooltipData: LimitOrderTooltipData =
      getLimitOrderTooltipData(
        event.detail,
        this.coinData,
        this.exchange,
        this.chartSettings,
        levels as unknown as ChartOverlayLevel[],
        this.translateService,
      );

    this.limitOrderTooltipHtml += `${this.translateService.instant('limit_order_tooltip.price')}: ${limitOrderTooltipData.price}$<br>`;
    this.limitOrderTooltipHtml += `${this.translateService.instant('limit_order_tooltip.distance')}: ${limitOrderTooltipData.distance}%<br>`;
    this.limitOrderTooltipHtml += `${this.translateService.instant('limit_order_tooltip.sum')}: ${limitOrderTooltipData.sum}$<br>`;
    this.limitOrderTooltipHtml += `${this.translateService.instant('limit_order_tooltip.quantity')}: ${limitOrderTooltipData.quantity}<br>`;
    this.limitOrderTooltipHtml += `${this.translateService.instant('limit_order_tooltip.corrosion_time')}: ${limitOrderTooltipData.corrosion_time} ${this.translateService.instant('app.minutes_short')}<br>`;
    this.limitOrderTooltipHtml += `${this.translateService.instant('limit_order_tooltip.living_time')}: ${limitOrderTooltipData.living_time} ${this.translateService.instant('app.minutes_short')}<br>`;
    if (limitOrderTooltipData.touches) {
      this.limitOrderTooltipHtml += `${this.translateService.instant('limit_order_tooltip.touches')}: ${limitOrderTooltipData.touches}<br>`;
    }
    if (limitOrderTooltipData.resume)
      this.limitOrderTooltipHtml += `<br><i>${limitOrderTooltipData.resume}</i>`;

    const mouseEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: position.x,
      clientY: position.y,
    });

    setTimeout(() => {
      this.limitOrderTooltip.show(
        mouseEvent,
        this.getTooltipElement(position.x, position.y),
      );
    });
  }

  private async loadUserTradesSnapshotData(entTime?: number) {
    const trades = await this.service.getUserTrades(
      this.symbol,
      this.exchange,
      entTime,
    );

    this.userTrades = [...this.userTrades, ...trades];
    this.messageService.add({
      severity: 'success',
      detail: `${this.symbol} ${this.translateService.instant('STATUS_MESSAGES.TRADES_LOADED_SUCCESSFULLY')}`,
      life: 5000,
    });
  }

  private async loadOpenInterestData(
    entTime?: number,
    limit: number = 500,
    loadMore: boolean = false,
  ): Promise<void> {
    if (
      !this.technicalIndicators?.length &&
      !Array.isArray(this.technicalIndicators)
    ) {
      return void 0;
    }

    const shouldLoad = this.technicalIndicators?.some((value) =>
      ['OI'].includes(value.name),
    );
    if (!shouldLoad) {
      return void 0;
    }

    const exchange: Exchange = Array.isArray(this.exchange)
      ? this.exchange[0]
      : this.exchange;
    const data = await this.service.getOpenInterestData(
      this.symbol,
      exchange,
      this.timeframe,
      entTime,
      limit,
    );

    if (loadMore) {
      this.openInterestData.unshift(...data);
    } else {
      this.openInterestData = data;
    }

    this.applyOpenInterestIndicators();

    if (
      this.candlesData.length > this.openInterestData.length &&
      this.openInterestData.length &&
      this.timeframe !== '1h' &&
      this.timeframe !== '4h' &&
      this.timeframe !== '1d'
    ) {
      await this.loadOpenInterestData(
        this.openInterestData[0].timestamp,
        limit,
        true,
      );
    }
  }

  private applyOpenInterestIndicators(): void {
    if (!this.chart) {
      return void 0;
    }

    for (const panes of this.chart.data.panes) {
      for (const overlay of panes.overlays) {
        if (['OI'].includes((overlay as any).category)) {
          const indicator = this.technicalIndicators.find(
            (indicator) => indicator.name === (overlay as any).category,
          );
          overlay.data = scriptsCalculator({
            type: indicator,
            candlesData: this.candlesData,
            precision: getPrecision(this.candlesData[0][1]),
            openInterestData: this.openInterestData,
          });
        }
      }
    }

    this.chart.update('data', { resetRange: false });
  }

  private getChartIndicatorPanes(): Pane[] {
    if (!this.technicalIndicators?.length) {
      return [];
    }

    const panes: Pane[] = [];
    const exchange: Exchange = Array.isArray(this.exchange)
      ? this.exchange[0]
      : this.exchange;

    if (!this.technicalIndicators || !this.technicalIndicators.length) {
      return [];
    }

    for (const indicator of this.technicalIndicators) {
      if (indicator.onlyFutures && !isExchangeFutures(exchange)) {
        continue;
      }

      if (indicator.onlyBinance && !exchange.includes('BINANCE')) {
        continue;
      }

      if (indicator.type === 'pane') {
        const pane = convertTechnicalIndicatorToPane(
          indicator,
          this.candlesData,
          this.openInterestData,
          getPrecision(this.candlesData[0][1]),
          this.fullChart,
        );
        if (pane) {
          panes.push(pane);
        }
      }
    }
    return panes;
  }

  private technicalIndicatorsPanesAndOverlays(): void {
    // Overlays
    const defaultOverlays = this.chart.data.panes[0].overlays.filter(
      (overlay) => mainOverlays.includes(overlay.name) || overlay.main,
    );
    this.chart.data.panes[0].overlays = [
      ...defaultOverlays,
      ...this.getChartIndicatorOverlays(),
    ];
    this.chart.data.panes = [
      this.chart.data.panes[0],
      ...this.getChartIndicatorPanes(),
    ];
    let shouldLoadOIData = false;
    if (
      this.technicalIndicators?.length &&
      Array.isArray(this.technicalIndicators)
    ) {
      shouldLoadOIData = this.technicalIndicators?.some((value) =>
        ['OI'].includes(value.name),
      );
    }
    if (shouldLoadOIData && !this.openInterestData.length) {
      this.loadOpenInterestData();
    }

    this.toggleHorizontalLevels();
    this.toggleTrendLevels();
    this.toggleLimitOrders();
    this.toggleDailyHighLowsData();

    // this.chart.update('data', { resetRange: false });
    // setTimeout(() => {
    //   this.chart.update('data', { resetRange: false });
    // });
  }

  private updateNotificationsPane(): void {
    this.updateNotificationsIndicator();
  }

  private onChartRangeUpdate(range: [number, number]): void {
    this.loadMore();

    if (this.chartSyncKeyPressed) {
      const candlesLength = calculateCandleCount(
        range[0],
        range[1],
        this.timeframe,
      );

      this.appEventService.emitEvent({
        name: 'chart:range-updated',
        data: {
          timeframe: this.timeframe,
          candlesLength,
          range,
          initiatorSymbol: this.symbol,
        },
      });
    }
  }

  private getChartIndicatorOverlays(): Overlay[] {
    if (!this.technicalIndicators?.length) {
      return [];
    }

    const overlays: Overlay[] = [];
    const exchange: Exchange = Array.isArray(this.exchange)
      ? this.exchange[0]
      : this.exchange;

    if (!this.technicalIndicators || !this.technicalIndicators.length) {
      return [];
    }

    for (const indicator of this.technicalIndicators) {
      if (indicator.type === 'overlay') {
        if (indicator.onlyFutures && !isExchangeFutures(exchange)) {
          continue;
        }

        if (indicator.onlyBinance && !exchange.includes('BINANCE')) {
          continue;
        }

        if (indicator.name === 'CoinData' && !this.isMainChart) {
          continue;
        }

        const overlay = convertTechnicalIndicatorToOverlay(
          indicator,
          this.candlesData,
          getPrecision(this.candlesData[0]?.[1]),
          this.coinData,
          exchange,
          this.fullChart,
          this.userTrades,
          this.notifications,
          this.timeframe,
          this.liquidationsData,
        );

        if (overlay) {
          overlays.push(overlay);
        }
      }
    }
    return overlays.sort((a, b) => {
      if (a.type === 'CoinData') {
        return 1;
      }
      return -1;
    });
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Alt') {
      this.chartSyncKeyPressed = true;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Alt') {
      this.chartSyncKeyPressed = false;
    }
  }

  private getTooltipElement(x: number, y: number): HTMLElement {
    const tooltipElement = document.getElementById('tooltip-target');

    if (tooltipElement) {
      tooltipElement.style.position = 'fixed';
      tooltipElement.style.top = `${y}px`;
      tooltipElement.style.left = `${x}px`;
    }
    return tooltipElement;
  }

  private clearChartData(): void {
    this.candlesData = [];
    this.userTrades = [];
    this.openInterestData = [];
    this.liquidationsData = {};

    this.chunkLoaded = 0;

    this.errorMessage = '';
  }

  private destroyDataStreaming(): void {
    const exchange: Exchange = Array.isArray(this.exchange)
      ? this.exchange[0]
      : this.exchange;
    this.service.destroy(this.symbol, exchange, this.timeframe, this.id);

    if (this.destroyed$ && !this.destroyed$.closed) {
      this.destroyed$.next();
      this.destroyed$.complete();
    }

    if (this.tradesDestroyed$ && !this.tradesDestroyed$.closed) {
      this.tradesDestroyed$.next();
      this.tradesDestroyed$.complete();
    }

    this.candlestickSubscription$?.unsubscribe();
    this.priceCrossingAlertsSubscription$?.unsubscribe();
    this.userTradesSubscription$?.unsubscribe();

    this.destroyed$ = new Subject<void>();
    this.tradesDestroyed$ = new Subject<void>();
    this.userTradesSubscription$ = new Subscription();
  }

  private async loadLiquidationsData(
    start: number = 0,
    end: number = 1000,
    loadMore: boolean = false,
  ): Promise<void> {
    const shouldLoad = this.technicalIndicators.some((value) =>
      ['Liquidations', 'LiquidationBubbles'].includes(value.name),
    );
    if (!shouldLoad) {
      return void 0;
    }

    const data = await this.service.getLiquidationsData(
      this.symbol,
      this.exchange,
      this.timeframe,
      start,
      end,
    );

    if (loadMore) {
      this.liquidationsData = { ...data, ...this.liquidationsData };
    } else {
      this.liquidationsData = data;
    }

    this.applyLiquidationDataIndicators();
  }

  private applyLiquidationDataIndicators(): void {
    if (!this.chart) {
      return void 0;
    }

    for (const panes of this.chart.data.panes) {
      for (const overlay of panes.overlays) {
        if (
          ['Liquidations', 'LiquidationBubbles'].includes(
            (overlay as any).category,
          )
        ) {
          const indicator = this.technicalIndicators.find(
            (indicator) => indicator.name === (overlay as any).category,
          );
          overlay.data = scriptsCalculator({
            type: indicator,
            candlesData: this.candlesData,
            precision: getPrecision(this.candlesData[0][1]),
            liquidationsData: this.liquidationsData,
            symbolData: this.coinData,
          });
        }
      }
    }

    this.chart.update('data', { resetRange: false });
  }

  private async loadCandleStickData(endTime?: number): Promise<number[]> {
    this.klinesLoading = true;
    const exchange: Exchange = Array.isArray(this.exchange)
      ? this.exchange[0]
      : this.exchange;
    const data: CandlestickVisualization[] = endTime
      ? await this.service.getMoreKlinesData(
          this.symbol,
          exchange,
          this.timeframe,
          endTime,
        )
      : await this.service.getKlinesData(this.symbol, exchange, this.timeframe);
    const result = [];

    for (const {
      time,
      open,
      high,
      low,
      close,
      volume,
      buyVolume,
      sellVolume,
    } of data) {
      result.push([
        time * 1000,
        open,
        high,
        low,
        close,
        volume,
        buyVolume,
        sellVolume,
      ]);
    }
    this.klinesLoading = false;
    this.cdr.detectChanges();
    return result;
  }

  private async updateCandlestickData(
    data: CandlestickVisualization,
  ): Promise<void> {
    if (!this.chart) {
      return void 0;
    }

    if (data.symbol && data.symbol !== this.symbol) {
      this.destroyDataStreaming();
      return void 0;
    }

    const roundedTimestamp: number = data.time * 1000;
    const time = data.newCandle
      ? roundDate(new Date(roundedTimestamp), this.timeframe).getTime()
      : Math.round(data.time) * 1000;

    const lastCandle = this.candlesData[this.candlesData.length - 1];
    data.newCandle = lastCandle[0] !== time;

    const ohlcData = [
      time,
      data.open,
      data.high,
      data.low,
      data.close,
      data.volume,
      data.sellVolume,
      data.buyVolume,
    ];

    if (data.newCandle) {
      this.candlesData = [...this.candlesData, ohlcData];

      (this.chart as any).scroll();
      this.chart.update('data', { resetRange: false });
    } else {
      this.candlesData[this.candlesData.length - 1] = ohlcData;
    }

    this.chart.data.panes[0].overlays[0].data = this.candlesData;

    try {
      this.chart.update('data', { resetRange: false });
    } catch (e) {
      this.destroyDataStreaming();
    }

    // this.updateHorizontalLevelsData();
  }

  private async saveDrawingTools(): Promise<void> {
    this.drawingTools = this.chart.data.panes[0].overlays
      .filter((overlay) => (overlay as any).drawingTool)
      .map((overlay) =>
        overlay.data.map((data) => {
          data.overlayType = overlay.type;
          return data;
        }),
      )
      .flat();

    const data = {
      symbol: this.symbol,
      data: this.drawingTools,
    };

    await this.service.saveDrawingTools(data);

    this.appEventService.emitEvent({
      name: 'chart:drawing-tools-updated',
      data: {
        data: data.data,
        symbol: this.symbol,
        exchange: this.exchange,
        timeframe: this.timeframe,
      },
    });
  }

  private async draw(
    resetRange = false,
    changeChartColors = false,
    showSpinner = true,
  ): Promise<void> {
    this.showChart = true;
    this.errorMessage = undefined;

    if (showSpinner) this.displayProgressSpinner = true;

    if (this.fullChart) {
      this.titleService.setTitle(
        `${this.symbol.replace('USDT', '')} ${getExchangeData(this.exchange).market}. - ${this.timeframe}`,
      );
    }

    const currentSymbol = this.symbol;
    const currentExchange = this.exchange;
    const currentTimeframe = this.timeframe;

    this.destroyDataStreaming();

    this.priceCrossingAlerts$ = this.service.getPriceCrossingAlertsBySymbol(
      this.symbol,
      this.exchange,
    );

    this.chunkLoaded = 0;
    this.drawingTools = [];
    this.openInterestData = [];

    const userData = await firstValueFrom(this.user$);

    if (
      currentSymbol !== this.symbol ||
      currentExchange !== this.exchange ||
      currentTimeframe !== this.timeframe
    ) {
      console.log('Symbol changed during data loading, aborting draw');
      return;
    }

    if (userData) {
      [this.candlesData, this.drawingTools] = await Promise.all([
        this.loadCandleStickData(),
        this.service.getDrawingTools(this.symbol),
      ]);
      this.loadLiquidationsData();
    } else {
      this.candlesData = await this.loadCandleStickData();
    }

    if (
      currentSymbol !== this.symbol ||
      currentExchange !== this.exchange ||
      currentTimeframe !== this.timeframe
    ) {
      console.log('Symbol changed after data loading, aborting draw');
      return;
    }

    await this.loadOpenInterestData();

    const id = this.fullChart
      ? `chart-container-${this.id}`
      : `mini-chart-container-${this.id}`;

    const DEFAULT_LEN = this.fullChart ? 400 : 170;

    const overlays = this.getOverlays(userData?.premium_enabled);

    if (!this.chart) {
      this.chart = new NightVision(id, {
        id: id.replaceAll('-', '_'),
        timezone: new Date().getTimezoneOffset() / -60,
        autoResize: true,
        config: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ZOOM_MODE: 'tl',
          EXPAND: 0.15,
          DEFAULT_LEN: this.chartSettings.candlesLength ?? DEFAULT_LEN,
          MAX_ZOOM: Infinity,
          TOOLBAR: 0,
          DOUBLE_CLICK_ALERT:
            this.preferences.chartThemeSettings.doubleClickAlert ?? false,
        },
        colors: {
          ...getChartThemeColors(
            this.preferences.chartThemeSettings ??
              initialPreferencesState.chartThemeSettings,
          ),
        },
        data: {
          panes: [
            {
              overlays,
              settings: {
                scales: {
                  A: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    log:
                      this.preferences.chartThemeSettings.chartYScale === 'Log',
                  },
                },
              },
            },
            ...this.getChartIndicatorPanes(),
          ],
        },
        scripts: [
          SIGNAL_LEVEL_NAVY,
          COIN_DATA_NAVY,
          HORIZONTAL_LEVEL_NAVY,
          TREND_LEVEL_NAVY,
          CANDLES,
          LIMIT_ORDER_LEVEL_NAVY,
          DAILY_LOW_HIGH_NAVY,
          SPLINE_NAVY,
          USER_TRADES,
          NOTIFICATIONS_STORY_NAVY,
          BUBBLES_NAVY,
          BARS_NAVY,
          SESSION_ZONES_NAVY,
        ],
      });

      this.setChartOffset();
    } else {
      if (changeChartColors) {
        this.chart.colors = {
          ...this.chart.colors,
          ...getChartThemeColors(
            this.preferences.chartThemeSettings ??
              initialPreferencesState.chartThemeSettings,
          ),
        };
      }

      this.chart.config['DOUBLE_CLICK_ALERT'] =
        this.preferences.chartThemeSettings.doubleClickAlert ?? false;

      this.chart.data.panes = [
        {
          overlays,
          settings: {
            scales: {
              A: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                log: this.preferences.chartThemeSettings.chartYScale === 'Log',
              },
            },
          },
        },
        ...this.getChartIndicatorPanes(),
      ];
      console.log(this.chart);

      this.chart.events.emit('sidebar-transform', {
        gridId: this.chart.hub.chart.id,
        scaleId: this.chart.hub.chart.settings.scaleIndex,
        zoom: 1.0,
        auto: true,
        updateLayout: true,
      });
      this.chart.update('full', { resetRange });
    }

    if (this.chart) {
      this.priceCrossingAlertsSubscription$ =
        this.priceCrossingAlerts$.subscribe((data) => {
          this.updateAlertsPane(data);
        });
      this.setupDataStreaming();
      this.handleNewDrawingToolsAdding();
      this.handleLegendControlsClick();
      this.handleDrawingToolSelection();
      this.handleDrawingModeOff();
      this.handleNewSignalLevelAdding();
      this.chart.events.on('app:$range-update', (range) => {
        this.onChartRangeUpdate(range);
      });

      this.setChartOffset();
    }

    this.displayProgressSpinner = false;

    this.cdr.detectChanges();
  }

  @HostListener('mousedown', ['$event'])
  public wheel(event: MouseEvent) {
    if (event.which === 2) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('mousewheel', ['$event'])
  public scroll(event: MouseEvent) {
    const id = (event.target as any)?.id;
    if (!id?.includes('right') && !id.includes('botbar')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  public changeDrawingToolSettings(drawingTool: DrawingTool): void {
    const drawingOverlay = this.chart.data.panes[0].overlays.find(
      (overlay) => (overlay as any).type === drawingTool.overlayType,
    );
    if (drawingOverlay) {
      const drawingToolToUpd: DrawingTool = drawingOverlay.data.find(
        (line) => (line as any).uuid === drawingTool.uuid,
      ) as unknown as DrawingTool;

      if (drawingToolToUpd) {
        drawingToolToUpd.color = drawingTool.color ?? '#dc9800';
        drawingToolToUpd.lineWidth = drawingTool.lineWidth ?? 1;
      }
    }

    this.chart.update('full', { resetRange: false });
    this.saveDrawingTools();
  }

  private setChartOffset(): void {
    const candleTimeInMs = getCandleTimeInMs(this.timeframe);
    const candleOffsetCount =
      this.chartSettings?.chartOffset ?? this.getCandlesOffsetCount();

    if (this.chart?.range) {
      this.chart.range[1] =
        new Date().getTime() + candleTimeInMs * candleOffsetCount;
    }
  }

  private getCandlesOffsetCount(): number {
    if (this.chartSettings.candlesLength < 100) {
      return 5;
    }
    if (this.chartSettings.candlesLength < 300) {
      return 20;
    }
    if (this.chartSettings.candlesLength < 500) {
      return 30;
    }
    if (this.chartSettings.candlesLength < 800) {
      return 50;
    }
    return 100;
  }

  private generateHorizontalLevelsOverlay(): Overlay {
    return convertCandlesToHorizontalLevelsOverlay(
      this.preferences,
      this.candlesData,
      this.fullChart,
      this.chartSettings,
      this.coinData,
      !!this.chartSettings.roundHorizontalLevels,
      this.coinData.current_price,
    );
  }

  private getOverlays(premium: boolean) {
    const overlays = [];

    if (premium && this.chartSettings.showHorizontalLevels) {
      const horizontalLevelsOverlay = this.generateHorizontalLevelsOverlay();
      overlays.push(horizontalLevelsOverlay);
    }

    if (premium && this.chartSettings.showTrendLevels) {
      const trendLevelsOverlay = convertCandlesToTrendlineLevelsOverlay(
        this.candlesData,
        this.chartSettings,
        this.preferences,
        this.fullChart,
        this.coinData.use_backend_trend_levels,
        this.coinData.trend_levels ?? {},
      );
      overlays.push(trendLevelsOverlay);
    }

    if (premium && this.chartSettings.showLimitOrders) {
      const limitOrdersOverlay = convertCandlesToLimitOrdersOverlay(
        this.candlesData,
        this.coinData,
        this.chartSettings,
        this.preferences,
        this.fullChart,
        this.chartInOverlay,
      );
      overlays.push(limitOrdersOverlay);
    }

    if (premium && this.chartSettings.showDailyHighAndLow) {
      const dailyHighLowOverlay = convertDailyHighLowsOverlay(
        this.coinData.daily_high_lows,
        this.preferences,
        this.fullChart,
        this.translateService.instant('technical_indicators.dailyHighTitle'),
        this.translateService.instant('technical_indicators.dailyLowTitle'),
      );
      overlays.push(dailyHighLowOverlay);
    }

    return [
      ...this.getDefaultOverlays(),
      ...overlays,
      ...this.getChartIndicatorOverlays(),
    ];
  }

  private handleLegendControlsClick(): void {
    this.chart.events.on(
      'app:select-overlay',
      async ({
        index: [pane, overlay, type],
      }: {
        index: [pane: number, overlay: number, type: string];
      }) => {
        const dataPane = this.chart.hub.data.panes[pane];
        const dataOverlay = dataPane.overlays[overlay];
        const technicalIndicators = JSON.parse(
          JSON.stringify(this.technicalIndicators),
        );

        if (type === 'settings') {
          const idxToUpdate: number = technicalIndicators.findIndex(
            (value: ChartTechnicalIndicators) =>
              value.label === dataOverlay.name,
          );
          if (idxToUpdate === -1) {
            return void 0;
          }

          const props: ChartIndicatorsProps =
            await this.service.openChartIndicatorSettings(
              technicalIndicators[idxToUpdate],
              this.premium,
            );

          technicalIndicators[idxToUpdate].props = props;
          this.chartIndicatorsChange.emit(technicalIndicators);
        }

        if (type === 'close') {
          const idxToRemove: number = technicalIndicators.findIndex(
            (value: ChartTechnicalIndicators) =>
              value.label === dataOverlay.name,
          );
          if (idxToRemove === -1) {
            return void 0;
          }
          technicalIndicators.splice(idxToRemove, 1);
          this.chartIndicatorsChange.emit(technicalIndicators);
        }
      },
    );
  }

  private async loadMore() {
    if (!this.chart.hub.mainOv) {
      return void 0;
    }

    if (this.klinesLoading) {
      return void 0;
    }

    if (!this.chart && !this.chart?.range) {
      return void 0;
    }

    const data = this.chart.hub.mainOv.data;
    const t0 = data[0][0];

    if (this.chart.range[0] < t0) {
      const newCandlesData = await this.loadCandleStickData(t0 - 1);

      this.chunkLoaded += 1;
      this.candlesData.unshift(...newCandlesData);

      await this.loadOpenInterestData(t0 - 1, 200, true);

      this.updateMainOverlay();
      this.updateTechnicalIndicatorsPanesAndOverlays();
      this.updateHorizontalLevelsData();

      setTimeout(() => {
        this.chart.update('data', { resetRange: false });
        this.chart.update('layout', { resetRange: false });
      });
    }
  }

  private updateTechnicalIndicatorsPanesAndOverlays(): void {
    const newChartIndicatorOverlays = this.getChartIndicatorOverlays();
    for (const overlay of this.chart.data.panes[0].overlays) {
      if (mainOverlays.includes(overlay.name) || overlay.main) {
        continue;
      }

      for (const updOverlay of newChartIndicatorOverlays) {
        if (updOverlay.name === overlay.name) {
          overlay.data = updOverlay.data;
        }
      }
    }

    const newChartIndicatorPanes = this.getChartIndicatorPanes();
    for (const pane of this.chart.data.panes) {
      const overlayName = pane.overlays[0].name;

      for (const updPane of newChartIndicatorPanes) {
        if (
          ['OBBarsDelta', 'OBOverlayDelta'].includes(
            (updPane.overlays[0] as any).category,
          )
        ) {
          continue;
        }

        const updPaneOverlayName = updPane.overlays[0].name;
        if (updPaneOverlayName === overlayName) {
          pane.overlays[0].data = updPane.overlays[0].data;
        }
      }
    }
  }

  private getDefaultOverlays() {
    const candlesData = [...this.candlesData];

    return [
      {
        name: this.fullChart ? `${this.symbol} - ${this.timeframe}` : '',
        type: getChartType(this.preferences.chartThemeSettings.chartType),
        main: this.fullChart,
        data: getChartDataByChartType('candlestick', candlesData),
        settings: {
          showLegend: this.preferences.chartThemeSettings.showLegend,
        },
        props: {
          ...(this.preferences.chartThemeSettings ??
            initialPreferencesState.chartThemeSettings),
        },
      },
      ...getDrawingOverlays(this.drawingTools, this.preferences),
      convertPriceLevelToOverlay([]),
    ];
  }

  private handleNewDrawingToolsAdding(): void {
    this.chart.events.on('app:commit-tool-changes', () => {
      this.saveDrawingTools();
    });
  }

  private handleDrawingModeOff(): void {
    this.chart.events.on('app:drawing-mode-off', () => {
      this.drawingToolChange.emit('Cursor');
    });
  }

  private handleDrawingToolSelection(): void {
    this.chart.events.on('app:object-selected', ({ id, type }) => {
      if (
        [
          'LongShortPosition',
          'ShortLongPosition',
          'FibRetracement',
          'Text',
        ].includes(type)
      ) {
        this.selectedDrawingTool = undefined;
        this.cdr.detectChanges();
        return void 0;
      }

      if (!id || !type) {
        this.selectedDrawingTool = undefined;
        this.cdr.detectChanges();
        return void 0;
      }

      if (!(this.chart.meta as any).drawingMode) {
        const drawingOverlay = this.chart.data.panes[0].overlays.find(
          (overlay) => (overlay as any).type === type,
        );
        if (drawingOverlay) {
          const drawingTool: DrawingTool = drawingOverlay.data.find(
            (line) => (line as any).uuid === id,
          ) as unknown as DrawingTool;

          if (drawingTool) {
            this.selectedDrawingTool = drawingTool as DrawingTool;
            this.cdr.detectChanges();
          }
        }
      }
    });
  }

  private updateMainOverlay(): void {
    const overlayIdx = this.chart.data.panes[0].overlays.findIndex(
      (overlay) => overlay.main,
    );

    if (overlayIdx === -1) {
      return void 0;
    }

    this.chart.data.panes[0].overlays[overlayIdx].data = this.candlesData;
    // this.chart.update('data', {resetRange: false});
  }

  private async handleNewSignalLevelAdding(): Promise<void> {
    let prevSignalPrice = 0;
    this.chart.events.on('app:add-signal-level', async (event) => {
      if (!this.isAuth) {
        this.authService.openAuthPopup('register');
        return void 0;
      }

      const priceCrossingAlerts = await firstValueFrom(
        this.alertsService.getPriceCrossingAlerts(),
      );
      if (!this.premium && priceCrossingAlerts.length >= 5) {
        this.premiumForbiddenDialogService.open(
          'Более 5 уведомлений о пересечении цены открываются в премиум доступе',
        );
        return void 0;
      }

      // await this.confirmationPopup.confirm(`[${this.symbol}] Создать уведомление о пересечении цены ${event.yValue.toFixed(4)}$?`)
      if (!event.yValue) {
        return void 0;
      }

      if (prevSignalPrice === event.yValue) {
        return void 0;
      }

      prevSignalPrice = event.yValue;
      const precision: number = this.chart.layout.main.prec;

      this.service.createFastSignalLevelAlert(
        parseFloat(event.yValue.toFixed(precision)),
        this.symbol,
        this.exchange,
      );
    });
  }

  private updateAlertsPane(priceCrossingAlerts: Alert[]): void {
    if (!this.chart || !this.chart?.data?.panes.length) {
      return void 0;
    }

    const overlayIdx = this.chart.data?.panes?.[0].overlays.findIndex(
      (overlay) => overlay.type === 'SignalLevel',
    );

    if (overlayIdx === -1) {
      return void 0;
    }

    this.chart.data.panes[0].overlays[overlayIdx].data =
      priceCrossingAlerts.map((alert: Alert) => [
        {
          symbol: alert.symbol,
          value: alert.price_crossing,
          id: alert.id,
        },
      ]);

    this.chart?.update('data', { resetRange: false });
  }

  private updateCoinsData(): void {
    if (!this.chart) {
      return void 0;
    }

    const idx = this.chart.data.panes[0].overlays.findIndex(
      (overlay) => overlay.type === 'CoinData',
    );

    if (idx !== -1) {
      let coinDataIndicator;
      if (
        this.chartSettings?.technicalIndicators &&
        this.chartSettings.technicalIndicators?.length
      ) {
        coinDataIndicator = this.chartSettings?.technicalIndicators?.find(
          (i) => i.name === 'CoinData',
        );
      }

      const props = coinDataIndicator?.props ?? defaultCoinDataProps;

      this.chart.data.panes[0].overlays[idx].data = [
        this.coinData,
      ] as unknown as OverlayData;

      this.chart.data.panes[0].overlays[idx].props = {
        smallChart: this.element.nativeElement.innerWidth < 820,
        fullChart: this.fullChart,
        textColor: getTextColor(),
        ...JSON.parse(JSON.stringify(props)),
      };
    }
    this.chart.update('full', { resetRange: false });
  }

  private updateLimitOrdersData(): void {
    if (!this.chart || !this.userData?.premium_enabled) {
      return void 0;
    }

    const idx = this.chart.data.panes[0].overlays.findIndex(
      (overlay) => overlay.type === 'LimitOrdersLevels',
    );
    if (idx !== -1) {
      this.chart.data.panes[0].overlays[idx].data = calculateLimitOrders(
        this.candlesData,
        this.coinData,
        this.chartSettings,
      );
      // this.chart.data.panes[0].overlays[idx] = convertCandlesToLimitOrdersOverlay(this.candlesData, this.coinData, this.chartSettings, this.preferences, this.fullChart);
    }
  }

  private updateUserTradesData(): void {
    if (!this.chart || !this.userData?.premium_enabled) {
      return void 0;
    }

    const idx = this.chart.data.panes[0].overlays.findIndex(
      (overlay) => overlay.type === 'UserTrades',
    );

    const userTradesIndicator = this.chartSettings?.technicalIndicators?.find(
      (i) => i.name === 'UserTrades',
    );

    const props = userTradesIndicator?.props ?? defaultUserTradesIndicatorProps;

    if (idx !== -1) {
      this.chart.data.panes[0].overlays[idx].data = calculateUserTradesData(
        props as UserTradesIndicatorProps,
        this.userTrades,
      );
    }
  }

  private setupUserTradesStream(): void {
    const shouldLoad = this.technicalIndicators?.some((value) =>
      ['UserTrades'].includes(value.name),
    );
    if (!shouldLoad) {
      return void 0;
    }

    this.service.setupUserTradesStream(this.exchange);
    this.subscribeToTradesData();
  }

  private subscribeToTradesData() {
    const shouldLoad = this.technicalIndicators?.some((value) =>
      ['UserTrades'].includes(value.name),
    );

    if (!shouldLoad) {
      return void 0;
    }

    this.userTradesSubscription$?.unsubscribe();
    this.userTradesSubscription$ = new Subscription();

    this.userTradesSubscription$ = this.service
      .subscribeToUserTrades(this.exchange, this.symbol)
      .pipe(takeUntil(this.tradesDestroyed$))
      .subscribe((data) => {
        this.userTrades = data;
        this.updateUserTradesData();
      });
  }

  private toggleHorizontalLevels(): void {
    if (!this.chart || !this.userData?.premium_enabled) {
      return void 0;
    }

    if (this.chartSettings.showHorizontalLevels) {
      const idx = this.chart.data.panes[0].overlays.findIndex(
        (overlay) => overlay.type === 'HorizontalLevels',
      );
      if (idx === -1) {
        this.chart.data.panes[0].overlays.push(
          this.generateHorizontalLevelsOverlay(),
        );
      }
    } else {
      const idx = this.chart.data.panes[0].overlays.findIndex(
        (overlay) => overlay.type === 'HorizontalLevels',
      );
      if (idx !== -1) {
        this.chart.data.panes[0].overlays.splice(idx, 1);
      }
    }
    this.chart.update('data', { resetRange: false });
  }

  private toggleTrendLevels(): void {
    if (!this.chart || !this.userData?.premium_enabled) {
      return void 0;
    }

    if (this.chartSettings.showTrendLevels) {
      const idx = this.chart.data.panes[0].overlays.findIndex(
        (overlay) => overlay.type === 'TrendLevels',
      );
      if (idx === -1) {
        this.chart.data.panes[0].overlays.push(
          convertCandlesToTrendlineLevelsOverlay(
            this.candlesData,
            this.chartSettings,
            this.preferences,
            this.fullChart,
            this.coinData.use_backend_trend_levels,
            this.coinData.trend_levels ?? {},
          ),
        );
      }
    } else {
      const idx = this.chart.data.panes[0].overlays.findIndex(
        (overlay) => overlay.type === 'TrendLevels',
      );
      if (idx !== -1) {
        this.chart.data.panes[0].overlays.splice(idx, 1);
      }
    }
    this.chart.update('data', { resetRange: false });
  }

  private toggleLimitOrders(): void {
    if (!this.chart || !this.userData?.premium_enabled) {
      return void 0;
    }

    if (this.chartSettings.showLimitOrders) {
      const idx = this.chart.data.panes[0].overlays.findIndex(
        (overlay) => overlay.type === 'LimitOrdersLevels',
      );
      if (idx === -1) {
        this.chart.data.panes[0].overlays.push(
          convertCandlesToLimitOrdersOverlay(
            this.candlesData,
            this.coinData,
            this.chartSettings,
            this.preferences,
            this.fullChart,
            this.chartInOverlay,
          ),
        );
      }
    } else {
      const idx = this.chart.data.panes[0].overlays.findIndex(
        (overlay) => overlay.type === 'LimitOrdersLevels',
      );
      if (idx !== -1) {
        this.chart.data.panes[0].overlays.splice(idx, 1);
      }
    }
    this.chart.update('data', { resetRange: false });
  }

  private toggleDailyHighLowsData(): void {
    if (!this.chart || !this.userData?.premium_enabled) {
      return void 0;
    }

    if (this.chartSettings.showDailyHighAndLow) {
      const idx = this.chart.data.panes[0].overlays.findIndex(
        (overlay) => overlay.type === 'HighLowLevels',
      );
      if (idx === -1) {
        this.chart.data.panes[0].overlays.push(
          convertDailyHighLowsOverlay(
            this.coinData.daily_high_lows,
            this.preferences,
            this.fullChart,
            this.translateService.instant(
              'technical_indicators.dailyHighTitle',
            ),
            this.translateService.instant('technical_indicators.dailyLowTitle'),
          ),
        );
      }
    } else {
      const idx = this.chart.data.panes[0].overlays.findIndex(
        (overlay) => overlay.type === 'HighLowLevels',
      );
      if (idx !== -1) {
        this.chart.data.panes[0].overlays.splice(idx, 1);
      }
    }
    this.chart.update('data', { resetRange: false });
  }

  private updateDailyHighLowsData(): void {
    if (!this.chart || !this.userData?.premium_enabled) {
      return void 0;
    }

    const idx = this.chart.data.panes[0].overlays.findIndex(
      (overlay) => overlay.type === 'HighLowLevels',
    );

    if (idx !== -1) {
      this.chart.data.panes[0].overlays[idx].data = calculateDailyHighLows(
        this.coinData.daily_high_lows,
      );
      this.chart.update('data', { resetRange: false });
    }
  }

  private updateHorizontalLevelsData(): void {
    if (!this.chart || !this.userData?.premium_enabled) {
      return void 0;
    }

    const idx = this.chart.data.panes[0].overlays.findIndex(
      (overlay) => overlay.type === 'HorizontalLevels',
    );
    if (idx !== -1) {
      this.chart.data.panes[0].overlays[idx].data = calculateHorizontalLevels(
        this.candlesData,
        this.chartSettings,
        this.coinData,
        this.chartSettings.roundHorizontalLevels,
        this.coinData.current_price,
      );
      this.chart?.update('data', { resetRange: false });
    }
  }

  private async toggleDrawingTools(data: {
    data: DrawingTool[];
    timeframe: Timeframe;
  }) {
    if (this.timeframe === data.timeframe) {
      return void 0;
    }
    this.drawingTools = data.data;

    // todo: make me better
    for (const overlay of this.chart.data.panes[0].overlays) {
      if ((overlay as any).drawingTool) {
        if (overlay.type === 'LineToolHorizontalRay') {
          overlay.data = this.drawingTools.filter(
            (data: LineDrawingTool) => data?.type === 'ray',
          ) as unknown as OverlayData;
          (overlay as any).dataExt.lines = overlay.data;
        }

        if (overlay.type === 'LineTool') {
          overlay.data = this.drawingTools.filter(
            (data: LineDrawingTool) => data?.type === 'segment',
          ) as unknown as OverlayData;
          (overlay as any).dataExt.lines = overlay.data;
        }

        if ((overlay as any)?.type === 'Brush') {
          overlay.data = this.drawingTools.filter(
            (data) => data?.overlayType === 'Brush',
          ) as unknown as OverlayData;
          (overlay as any).dataExt.brushes = overlay.data;
        }

        if ((overlay as any)?.type === 'Rectangle') {
          overlay.data = this.drawingTools.filter(
            (data) => data?.overlayType === 'Rectangle',
          ) as unknown as OverlayData;
          (overlay as any).dataExt.rectangles = overlay.data;
        }

        if ((overlay as any)?.type === 'ShortLongPosition') {
          overlay.data = this.drawingTools.filter(
            (data) => data?.overlayType === 'ShortLongPosition',
          ) as unknown as OverlayData;
          (overlay as any).dataExt.rectangles = overlay.data;
        }

        if ((overlay as any)?.type === 'LongShortPosition') {
          overlay.data = this.drawingTools.filter(
            (data) => data?.overlayType === 'LongShortPosition',
          ) as unknown as OverlayData;
          (overlay as any).dataExt.rectangles = overlay.data;
        }

        if ((overlay as any)?.type === 'FibRetracement') {
          overlay.data = this.drawingTools.filter(
            (data) => data?.overlayType === 'FibRetracement',
          ) as unknown as OverlayData;
          (overlay as any).dataExt.lines = overlay.data;
        }

        if ((overlay as any)?.type === 'Text') {
          overlay.data = this.drawingTools.filter(
            (data) => data?.overlayType === 'Text',
          ) as unknown as OverlayData;
          (overlay as any).dataExt.rectangles = overlay.data;
        }
      }
    }

    this.chart.update('grid', { resetRange: false });
  }

  private updateChartSettings(): void {
    if (!this.chart) {
      return void 0;
    }
    this.chart.colors = {
      ...getChartThemeColors(
        this.preferences.chartThemeSettings ??
          initialPreferencesState.chartThemeSettings,
      ),
    };
    const candlesOverlay = this.chart.data.panes[0].overlays.find(
      (overlay) => overlay.type === 'CandlesPlus',
    );
    if (candlesOverlay) {
      candlesOverlay.props = {
        ...candlesOverlay?.props,
        ...getChartThemeColors(
          this.preferences.chartThemeSettings ??
            initialPreferencesState.chartThemeSettings,
        ),
      };
    }

    this.chart.data.panes[0].settings = {
      scales: {
        A: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          log: this.preferences.chartThemeSettings.chartYScale === 'Log',
        },
      },
    };

    this.chart.update();
  }

  private updateNotificationsIndicator(): void {
    if (!this.chart) {
      return void 0;
    }

    if (!this.candlesData?.length) {
      return void 0;
    }

    for (const panes of this.chart.data.panes) {
      for (const overlay of panes.overlays) {
        if (['NotificationsStory'].includes((overlay as any).category)) {
          const indicator = this.technicalIndicators.find(
            (indicator) => indicator.name === (overlay as any).category,
          );
          overlay.data = scriptsCalculator({
            type: indicator,
            candlesData: this.candlesData,
            precision: getPrecision(this.candlesData[0][1]),
            openInterestData: this.openInterestData,
            symbolData: this.coinData,
            notifications: this.notifications,
            timeframe: this.timeframe,
          });
        }
      }
    }

    // this.chart.update('data', {resetRange: false});
  }

  protected readonly window = window;
}
