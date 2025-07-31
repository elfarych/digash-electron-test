import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getTimeframes, Timeframe } from '../../models/Timeframe';
import { normalizeCoinQuoteSymbol } from '../../utils/normalizeCoinQuoteSymbol';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { MiniChartService } from './mini-chart.service';
import {
  Exchange,
  getExchangeData,
  getExchangeToSwap,
} from '../../models/Exchange';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { CoinData } from '../../models/CoinData';
import { Preferences } from '../../models/Preferences';
import { ChartSettings } from '../../models/ChartSettings';
import { Formations } from '../../models/Formations';
import { Alert } from '../../models/Alert';
import { WatchlistSelectionComponent } from '../watchlist-selection/watchlist-selection.component';
import { WatchlistCoin, WatchlistColor } from '../../models/Watchlist';
import { ChartTechnicalIndicators } from '../../models/chart-indicators/ChartIndicators';
import { NightVisionChartComponent } from '../night-vision-chart/night-vision-chart.component';
import html2canvas from 'html2canvas';
import { ButtonModule } from 'primeng/button';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ChartLayoutSelectorComponent } from './components/chart-layout-selector/chart-layout-selector.component';
import {
  ChartLayout,
  ChartLayoutData,
  chartLayoutOptions,
} from './models/ChartLayout';
import { SplitterModule } from 'primeng/splitter';
import { CandlestickIntervals } from '../../models/Candlestick';
import { UnauthorizedDirective } from '../../directives/unauthorized.directive';
import { PremiumForbiddenDialogService } from '../premium-forbidden-dialog/premium-forbidden-dialog.service';
import { DropdownModule } from 'primeng/dropdown';
import { AppFormationTooltipComponent } from './components/formation-tooltip/formation-tooltip.component';
import { UserData } from '../../models/Auth';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChartIndicatorsSelectionComponent } from '../chart-indicators-selection/chart-indicators-selection.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChartDrawingToolsComponent } from './plugins/chart-drawing-tools.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MenuModule } from 'primeng/menu';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { SymbolPipe } from '../../pipes/symbol.pipe';
import { ChartThemeSettingsComponent } from '../chart-settings/chart-theme-settings.component';
import { AlertNotification } from '../../models/Notification';
import { AlertsService } from '../../store/alerts/alerts.service';

const MOBILE_HINT = 'DIGASH_MOBILE_HINT';

@Component({
  selector: 'app-mini-chart',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerComponent,
    WatchlistSelectionComponent,
    NightVisionChartComponent,
    ButtonModule,
    SelectButtonModule,
    FormsModule,
    ToastModule,
    TooltipModule,
    ChartLayoutSelectorComponent,
    SplitterModule,
    UnauthorizedDirective,
    DropdownModule,
    AppFormationTooltipComponent,
    ChartIndicatorsSelectionComponent,
    TranslateModule,
    MenuModule,
    OverlayPanelModule,
    SymbolPipe,
    ChartThemeSettingsComponent,
  ],
  templateUrl: './mini-chart.component.html',
  styleUrls: ['./mini-chart.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniChartComponent
  extends ChartDrawingToolsComponent
  implements OnChanges, OnDestroy, OnInit
{
  @Input()
  public hasAlert: boolean = false;

  @Input()
  public showLayoutSelector: boolean = true;

  @Input()
  public chartId: string;

  @Input()
  public coin: string;

  @Input()
  public exchange: Exchange;

  @Input()
  public coinData: CoinData;

  @Input()
  public preferences: Preferences;

  @Input()
  public timeframe: Timeframe;

  @Input()
  public chartSettings: ChartSettings;

  @Input()
  public chartInOverlay: boolean = false;

  @Input()
  @HostBinding('class.full-chart')
  public fullChart: boolean;

  @Input()
  public formation: Formations;

  @Input()
  public alerts: Alert[];

  @Input()
  public watchlistCoins: WatchlistCoin[];

  @Input()
  public chartIndicators: ChartTechnicalIndicators[];

  @Input()
  public selectedChartId: string;

  @Input()
  public inDialog: boolean = false;

  @Input()
  public chartHorizontalGridData: ChartLayoutData[] = [];

  @Input()
  public chartVerticalGridData: ChartLayoutData[] = [];

  @Input()
  public chartLayout: ChartLayout;

  @Input()
  public timeframeView: 'dropdown' | 'list' = 'list';

  @Input()
  public showAlertIcon: boolean = false;

  @Input()
  public showWatchlist: boolean = true;

  @Input()
  public setPriceTitle: boolean = false;

  @Output()
  public openChart: EventEmitter<CoinData> = new EventEmitter<CoinData>();

  @Output()
  public changeChartId: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public layoutChanged: EventEmitter<ChartLayout> =
    new EventEmitter<ChartLayout>();

  @Output()
  public timeframeChanged: EventEmitter<CandlestickIntervals> =
    new EventEmitter<CandlestickIntervals>();

  @Output()
  public swapCoinExchange: EventEmitter<{
    exchange: Exchange;
    symbol: string;
  }> = new EventEmitter<{ exchange: Exchange; symbol: string }>();

  @Output()
  public candlesLenUpdated: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public selectTechnicalIndicator: EventEmitter<ChartTechnicalIndicators[]> =
    new EventEmitter<ChartTechnicalIndicators[]>();

  @ViewChild('container', { static: false })
  public chartContainerRef!: ElementRef;

  @ViewChild('clipboardImage', { static: false })
  public clipboardImage: ElementRef;

  @ViewChild('toolbar', { static: false })
  public toolbarRef!: ElementRef;

  @ViewChildren(NightVisionChartComponent)
  public override chartInstanceComponents!: QueryList<NightVisionChartComponent>;

  public isAuth$: Observable<boolean> = this.service.isAuth$;
  public isPremium$: Observable<boolean> = this.service.isPremium$;
  public userData$: Observable<UserData> = this.service.userData$;

  public timeframes = getTimeframes(this.translateService);
  public selectedTimeframe: Timeframe;
  public watchlistCoin: WatchlistCoin;
  public showClibpoardPreview = false;
  public coinAlerts: Alert[] = [];
  public displayProgressSpinner = false;
  public swapRotationAngle: number = 0;
  public isMobile: boolean = window.innerWidth <= 992;
  public coinToSwap: string;
  public userTradesIndicator: boolean = false;
  public selectedTrade: unknown;
  public screenshotItems = [];
  public notifications$: Observable<AlertNotification[]>;
  public isToolbarOpen: boolean = false;
  public showMobileHint: boolean = true;

  private chartUpdateSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private service: MiniChartService,
    private messageService: MessageService,
    private premiumForbiddenDialogService: PremiumForbiddenDialogService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer,
    private alertService: AlertsService,
    @Optional()
    private dialogRef: DynamicDialogRef,
    @Optional()
    @Inject(DynamicDialogConfig)
    public data?: {
      data: {
        dialog: true;
        coin: string;
        coinData: CoinData;
        preferences: Preferences;
        exchange: Exchange;
        timeframe: Timeframe;
        chartLayout: ChartLayout;
        chartSettings: ChartSettings;
        chartIndicators: ChartTechnicalIndicators[];
        showWatchlist: boolean;
        fullChart: boolean;
        showLayoutSelector: boolean;
        watchlistCoins: WatchlistCoin[];
      };
    },
  ) {
    super();
  }

  public ngOnInit(): void {
    if (this.data?.data?.dialog && !this.inDialog) {
      const { data } = this.data;

      this.coin = data?.coin;
      this.inDialog = true;
      this.coinData = data?.coinData;
      this.chartSettings = data?.chartSettings;
      this.chartLayout = data?.chartLayout;
      this.preferences = data?.preferences;
      this.exchange = data?.exchange;
      this.timeframe = data?.timeframe;
      this.selectedTimeframe = data?.timeframe;
      this.chartIndicators = data?.chartIndicators;
      this.showWatchlist = data?.showWatchlist;
      this.fullChart = data?.fullChart;
      this.watchlistCoins = data?.watchlistCoins;
      this.showLayoutSelector = data?.showLayoutSelector;

      this.handleWatchlistCoin();
    }

    this.showMobileHint =
      this.isMobile && this.fullChart && !localStorage.getItem(MOBILE_HINT);
  }

  public ngOnDestroy(): void {
    this.chartUpdateSubscription?.unsubscribe();
  }

  public ngOnChanges({
    coin,
    exchange,
    timeframe,
    watchlistCoins,
    coinData,
    preferences,
    chartIndicators,
  }: SimpleChanges): void {
    if (timeframe) {
      this.selectedTimeframe = this.timeframe;
    }

    if (watchlistCoins || coin || exchange) {
      this.handleWatchlistCoin();
    }

    if (coin) {
      this.setCoinToSwap();
      this.notifications$ = this.alertService.getNotificationsBySymbol(
        this.coin,
      );
    }

    if (coinData) {
      this.handleEmptyCoinData();
    }

    if (chartIndicators && this.chartIndicators?.length) {
      this.userTradesIndicator = !!this.chartIndicators.find(
        (indicator: ChartTechnicalIndicators) =>
          indicator.name === 'UserTrades',
      );
    }
  }

  @HostListener('document:user-trade-selected', ['$event'])
  public userTradeSelected(event: CustomEvent): void {
    this.selectedTrade = event.detail;
    this.screenshotItems = this.generateScreenshotItems();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isToolbarOpen && this.toolbarRef) {
      // const clickedInside = this.toolbarRef.nativeElement.contains(
      //   event.target,
      // );
      // if (!clickedInside) {
      //   this.isToolbarOpen = false;
      // }
      this.isToolbarOpen = false;
    }

    if (this.fullChart) {
      if (event.altKey && event.button === 0) {
        this.copyTicker(event);
      }
    }
  }

  public closeMobileHint(): void {
    this.showMobileHint = false;
    localStorage.setItem(MOBILE_HINT, '1');
  }

  public openToolbar(event: MouseEvent): void {
    event.stopPropagation();
    this.isToolbarOpen = true;
  }

  public get isDesktop(): boolean {
    return window.innerWidth > 992;
  }

  public handleSelectColor(color: WatchlistColor): void {
    this.service.changeWatchlistSymbolColor(this.coin, this.exchange, color);
  }

  public sanitizeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  public copyTicker(event: MouseEvent): void {
    event.preventDefault();
    navigator.clipboard.writeText(this.coin);
    this.messageService.add({
      severity: 'success',
      summary: this.coin.toString(),
      detail: this.translateService.instant('STATUS_MESSAGES.TICKER_COPIED'),
      life: 2000,
    });
  }

  public changeTimeframe(event: SelectButtonChangeEvent): void {
    this.selectedTimeframe = event.value as unknown as Timeframe;
    this.timeframeChanged.emit(event.value as unknown as Timeframe);
  }

  public changeTimeframeFromList(event): void {
    this.selectedTimeframe = event.option.name as unknown as Timeframe;
    this.timeframeChanged.emit(event.option.name as unknown as Timeframe);
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.code.toLowerCase() === 'keyt') {
      event.preventDefault();
      this.loadTrades();
    }

    if (event.ctrlKey && event.key === 'ArrowRight') {
      this.onCtrlArrowRight();
    }

    if (event.ctrlKey && event.key === 'ArrowLeft') {
      this.onCtrlArrowLeft();
    }
    if (event.shiftKey && event.code.toLowerCase() === 'keye') {
      this.swapExchange();
    }
    if (event.shiftKey && event.code.toLowerCase() === 'keyp') {
      this.screenshot();
    }
  }

  public chartIdentify(index: number, value: ChartLayoutData): number | string {
    return value.id;
  }

  public async layoutChange(event: ChartLayout): Promise<void> {
    const premium = await firstValueFrom(this.isPremium$);
    if (!premium) {
      this.premiumForbiddenDialogService.open(
        'Сетка монет открывается в премиум доступе',
      );
      return void 0;
    }

    this.layoutChanged.emit(event);
  }

  public swapExchange(): void {
    this.swapRotationAngle += 180;
    this.swapCoinExchange.emit({
      symbol: this.coinToSwap,
      exchange: getExchangeToSwap(this.exchange),
    });
  }

  public loadTrades(): void {
    for (const chartInstance of this.chartInstanceComponents) {
      chartInstance.loadTrades();
    }
  }

  public makeTradeScreenshot(
    template: OverlayPanel,
    withIncome: boolean = false,
  ): void {
    template.toggle(false);
    this.screenshot(withIncome);
  }

  public async screenshot(withIncome: boolean = false): Promise<void> {
    if (this.showClibpoardPreview) {
      return void 0;
    }
    this.displayProgressSpinner = true;
    this.cdr.detectChanges();

    let chartElement = document.getElementById(`chart-container-${this.coin}`);
    let pnlPercentElement: HTMLElement | undefined;
    let pnlDollarsElement: HTMLElement | undefined;
    if (!chartElement) {
      chartElement = document.querySelector(`night-vision-chart .chart`);
    }

    if (!chartElement) {
      this.displayProgressSpinner = false;
      this.cdr.detectChanges();
      return void 0;
    }

    // @ts-ignore
    const pnlPercentage = this.selectedTrade?.pnl;
    if (pnlPercentage) {
      pnlPercentElement = document.getElementById('pnlPercentage');
      if (pnlPercentElement) {
        pnlPercentElement.innerText =
          pnlPercentage > 0
            ? '+' + pnlPercentage?.toFixed(2) + '%'
            : pnlPercentage?.toFixed(2) + '%';
        pnlPercentElement.style.backgroundColor =
          pnlPercentage < 0 ? 'rgba(154,43,43,.65)' : 'rgba(47,147,84,.65)';
        pnlPercentElement.style.opacity = '0.75';
      }
    }

    if (withIncome) {
      pnlDollarsElement = document.getElementById('currentPnL');
      // @ts-ignore
      const pnlDollars = this.selectedTrade?.pnlDollars;
      if (pnlDollars) {
        if (pnlDollarsElement) {
          pnlDollarsElement.innerText =
            pnlDollars > 0
              ? '+' + pnlDollars?.toFixed(2) + '$'
              : pnlDollars?.toFixed(2) + '$';
          pnlDollarsElement.style.backgroundColor =
            pnlDollars < 0 ? 'rgba(154,43,43,.65)' : 'rgba(47,147,84,.65)';
          pnlDollarsElement.style.opacity = '0.75';
        }
      }
    }

    chartElement
      .querySelectorAll<HTMLElement>('.symbol-name')
      .forEach((el) => (el.style.opacity = '0'));

    chartElement
      .querySelectorAll<HTMLElement>('.watermark-screenshot')
      .forEach((el) => (el.style.opacity = '.4'));

    chartElement
      .querySelectorAll<HTMLElement>('.pnl-result')
      .forEach((el) => (el.style.opacity = '.4'));

    const canvasElement = await html2canvas(chartElement).then(
      (canvas) => canvas,
    );

    chartElement
      .querySelectorAll<HTMLElement>('.watermark-screenshot')
      .forEach((el) => (el.style.opacity = '0'));

    chartElement
      .querySelectorAll<HTMLElement>('.pnl-result')
      .forEach((el) => (el.style.opacity = '0'));

    chartElement
      .querySelectorAll<HTMLElement>('#pnlPercentage')
      .forEach((el) => (el.style.opacity = '0'));

    chartElement
      .querySelectorAll<HTMLElement>('#currentPnL')
      .forEach((el) => (el.style.opacity = '0'));

    chartElement
      .querySelectorAll<HTMLElement>('.symbol-name')
      .forEach((el) => (el.style.opacity = '0'));

    if (pnlDollarsElement) {
      pnlDollarsElement.innerText = '';
    }

    if (pnlPercentElement) {
      pnlPercentElement.innerText = '';
    }

    canvasElement.toBlob((blob) => {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]);
      this.clipboardImage.nativeElement.setAttribute(
        'src',
        canvasElement.toDataURL(),
      );

      this.displayProgressSpinner = false;
      this.showClibpoardPreview = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.showClibpoardPreview = false;
        this.cdr.detectChanges();
      }, 2000);
    });
  }

  private handleWatchlistCoin(): void {
    this.watchlistCoin = this.watchlistCoins?.find(
      (coin) => coin.symbol === this.coin,
    );
  }

  public generateScreenshotItems() {
    if (!this.selectedTrade) {
      return [];
    }

    // @ts-ignore
    const pnl = this.selectedTrade.pnlDollars;
    // @ts-ignore
    const pnlPercentage = this.selectedTrade.pnl;

    const pnlPercentText =
      pnlPercentage > 0
        ? '+' + pnlPercentage?.toFixed(2) + '%'
        : pnlPercentage?.toFixed(2) + '%';
    const pnlDollarsText =
      pnl > 0 ? '+' + pnl?.toFixed(2) + '$' : pnl?.toFixed(2) + '$';
    return [
      {
        label: this.translateService.instant('profile.withIncome', {
          pnlPercent: pnlPercentText,
          pnlDollars: pnlDollarsText,
        }),
        withIncome: true,
      },
      {
        label: this.translateService.instant('profile.withoutIncome', {
          pnlPercent: pnlPercentText,
        }),
        withIncome: false,
      },
    ];
  }

  private async handleEmptyCoinData(): Promise<void> {
    if (!this.coinData && this.fullChart) {
      this.coinData = await firstValueFrom(
        this.service.loadCoinData(this.coin, this.exchange),
      );
      this.cdr.detectChanges();
    }
  }

  private async setCoinToSwap(): Promise<void> {
    const coinToSwapData = await firstValueFrom(this.getCoinToSwap());
    this.coinToSwap = coinToSwapData?.symbol ?? null;
    this.cdr.detectChanges();
  }

  private getCoinToSwap(): Observable<{ symbol: string | null }> {
    return this.service.getCoinToSwap(this.exchange, this.coin);
  }

  private onCtrlArrowRight(): void {
    if (!this.fullChart) return void 0;

    const index = this.timeframes.findIndex(
      (i: { name: Timeframe; label: string }) => i.name === this.timeframe,
    );

    if (index !== -1 && this.timeframes[index + 1]) {
      this.changeTimeframe({ value: this.timeframes[index + 1].name });
    }
  }

  private onCtrlArrowLeft(): void {
    if (!this.fullChart) return void 0;

    const index = this.timeframes.findIndex(
      (i: { name: Timeframe; label: string }) => i.name === this.timeframe,
    );

    if (index !== -1 && this.timeframes[index - 1]) {
      this.changeTimeframe({ value: this.timeframes[index - 1].name });
    }
  }

  protected readonly chartLayoutOptions = chartLayoutOptions;
  protected readonly normalizeCoinQuoteSymbol = normalizeCoinQuoteSymbol;
  protected readonly getExchangeData = getExchangeData;
}
