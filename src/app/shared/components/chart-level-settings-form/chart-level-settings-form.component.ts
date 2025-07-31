import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartSettings } from '../../models/ChartSettings';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Timeframe } from '../../models/Timeframe';
import { IntervalMultiSelectorComponent } from '../interval-multi-selector/interval-multi-selector.component';
import { NavigationColumnsSettingsComponent } from './components/navigation-columns-settings/navigation-columns-settings.component';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ConvertPricePipe } from '../../pipes/convert-price.pipe';
import { debounceTime, Subscription } from 'rxjs';
import { CoinSortingType, SortingId } from '../../models/CoinsSorting';
import { AlertIntervalType } from '../../models/Alert';
import { AppIntervalSelectorComponent } from '../interval-selector/interval-selector.component';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { PremiumMessageBannerComponent } from '../premium-message-banner/premium-message-banner.component';
import { ChartSettingsType } from '../../types/base.types';
import { DefaultSettingsButtonComponent } from '../default-settings-button/default-settings-button.component';
import { BlacklistBuilderComponent } from '../blacklist-builder/blacklist-builder.component';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { TooltipsComponent } from '../tooltips/tooltips.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ExcludeExchangesComponent } from '../exclude-exchanges/exclude-exchanges.component';
import { Exchange } from '../../models/Exchange';
import { ConvertBigNumberPipe } from '../../pipes/convert-big-number.pipe';

type ChartLevelSettingsFormTabs =
  | 'columns'
  | 'horizontal'
  | 'trend'
  | 'limit_orders';

@Component({
  selector: 'app-chart-level-settings-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavigationColumnsSettingsComponent,
    ButtonModule,
    TabViewModule,
    CheckboxModule,
    SliderModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,
    DropdownModule,
    ConvertPricePipe,
    AppIntervalSelectorComponent,
    DividerModule,
    PanelModule,
    PremiumMessageBannerComponent,
    DefaultSettingsButtonComponent,
    BlacklistBuilderComponent,
    TooltipsComponent,
    TranslateModule,
    IntervalMultiSelectorComponent,
    ExcludeExchangesComponent,
    ConvertBigNumberPipe,
  ],
  templateUrl: './chart-level-settings-form.component.html',
  styleUrls: ['./chart-level-settings-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLevelSettingsFormComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input()
  public coinNavigationAutoSize: boolean;

  @Input()
  public activeSortingId: SortingId;

  @Output()
  public chartSettingsChange: EventEmitter<ChartSettings> =
    new EventEmitter<ChartSettings>();

  @Output()
  public columnSelectionChange: EventEmitter<SortingId> =
    new EventEmitter<SortingId>();

  @Output()
  public resetNavigationColumns = new EventEmitter();

  @Input()
  public chartSettings: ChartSettings;

  @Input()
  public selectedColumns: CoinSortingType[] = [];

  @Input()
  public isPremium: boolean = false;

  @Output()
  public toggleNavigationAutoSize = new EventEmitter();

  @Output()
  public excludeExchanges: EventEmitter<Exchange[]> = new EventEmitter<
    Exchange[]
  >();

  @Input()
  public chartForm: FormGroup = new FormGroup({
    // market: new FormControl<Exchange>('BINANCE_SPOT'),
    showDailyHighAndLow: new FormControl(true),
    showLimitOrders: new FormControl(true),
    showHorizontalLevels: new FormControl(true),
    round_density: new FormControl(false),
    showLimitOrdersMarker: new FormControl(true),
    horizontalLevelsTouchesThreshold: new FormControl(0.5),
    showTrendLevels: new FormControl(true),
    showActiveCoinTooltips: new FormControl(true),
    roundHorizontalLevels: new FormControl(false),
    horizontalLevelsPeriod: new FormControl(20, Validators.min(10)),
    horizontalLevelsTimeframes: new FormControl<Timeframe[]>([]),
    candlesLength: new FormControl(400, [
      Validators.min(50),
      Validators.max(1000),
    ]),
    chartOffset: new FormControl(50, [Validators.min(0), Validators.max(500)]),
    horizontalLevelsTouches: new FormControl(0, [
      Validators.min(0),
      Validators.max(5),
      Validators.required,
    ]),
    horizontalLevelsLivingTime: new FormControl(0, [
      Validators.min(0),
      Validators.max(1000),
      Validators.required,
    ]),
    limitOrderFilter: new FormControl(0, [
      Validators.min(0),
      Validators.max(1_000_000),
      Validators.required,
    ]),
    limitOrderDistance: new FormControl(5, [
      Validators.min(0),
      Validators.max(10),
      Validators.required,
    ]),
    limitOrderLife: new FormControl(0, [
      Validators.min(0),
      Validators.max(1000),
    ]),
    limitOrderCorrosionTime: new FormControl(0, [Validators.min(0)]),
    showDensitiesWidget: new FormControl(true),
    trendlinesSource: new FormControl<'high/low' | 'close'>('high/low'),
    trendlinesPeriod: new FormControl(20, Validators.min(10)),

    volumeFrom: new FormControl(0, [
      Validators.min(0),
      Validators.max(100_000_000_000),
    ]),
    volumeTo: new FormControl(100_000_000_000, [
      Validators.min(1_000_000),
      Validators.max(100_000_000_000),
    ]),
    tradesFrom: new FormControl(0, [
      Validators.min(0),
      Validators.max(100_000_000_000),
    ]),
    tradesTo: new FormControl(0, [
      Validators.min(0),
      Validators.max(100_000_000_000),
    ]),
    correlationFrom: new FormControl(0, [
      Validators.min(-100),
      Validators.max(100),
    ]),
    correlationTo: new FormControl(0, [
      Validators.min(-100),
      Validators.max(100),
    ]),

    priceChangeFrom: new FormControl(0, [
      Validators.min(-100),
      Validators.max(10000),
    ]),
    priceChangeTo: new FormControl(0, [
      Validators.min(-100),
      Validators.max(10000),
    ]),

    priceChangeInterval: new FormControl('interval_24h'),
    volumeInterval: new FormControl('interval_24h', [Validators.required]),
    tradesInterval: new FormControl('interval_24h', [Validators.required]),
    correlationInterval: new FormControl('interval_24h', [Validators.required]),
    showOnlyActiveCoins: new FormControl(false),
  });

  @Input()
  public coins: WorkspaceCoins[] = [];

  public activeTab: ChartLevelSettingsFormTabs = 'horizontal';
  public trendlineSources: { name: 'high/low' | 'close'; label: string }[] = [
    {
      name: 'high/low',
      label: this.translateService.instant('workspace.trendline.highLow'),
    },
    {
      name: 'close',
      label: this.translateService.instant('workspace.trendline.close'),
    },
  ];
  private subscriptions: Subscription = new Subscription();

  constructor(private translateService: TranslateService) {}

  public ngOnInit(): void {
    this.patchValues();

    this.subscriptions.add(
      this.chartForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe((values) =>
          this.chartSettingsChange.emit({ ...this.chartSettings, ...values }),
        ),
    );
  }

  public ngOnChanges({ chartSettings }: SimpleChanges): void {
    if (chartSettings) {
      if (
        chartSettings.currentValue?.showDensitiesWidget !==
        chartSettings.previousValue?.showDensitiesWidget
      ) {
        this.chartForm
          .get('showDensitiesWidget')
          .setValue(chartSettings.currentValue.showDensitiesWidget, {
            onlySelf: true,
          });
      }
    }

    if (chartSettings && !chartSettings.isFirstChange()) {
      this.patchValues();
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  public selectBlacklistCoin(coin: string): void {
    const blacklist = JSON.parse(
      JSON.stringify(this.chartSettings.blacklist || []),
    );
    const index = blacklist.indexOf(coin);
    if (index === -1) {
      blacklist.push(coin);
    } else {
      blacklist.splice(index, 1);
    }
    this.chartSettingsChange.emit({ ...this.chartSettings, blacklist });
  }

  public selectTab(tab: ChartLevelSettingsFormTabs): void {
    this.activeTab = tab;
  }

  public correlationIntervalChange(interval: AlertIntervalType): void {
    this.chartForm.get('correlationInterval').setValue(interval);
  }

  public volumeIntervalChange(interval: AlertIntervalType): void {
    this.chartForm.get('volumeInterval').setValue(interval);
  }

  public tradesIntervalChange(interval: AlertIntervalType): void {
    this.chartForm.get('tradesInterval').setValue(interval);
  }

  public priceChangeIntervalChange(interval: AlertIntervalType): void {
    this.chartForm.get('priceChangeInterval').setValue(interval);
  }

  public setDefaultSettings(type: ChartSettingsType): void {
    switch (type) {
      case 'all':
        return this.chartForm.patchValue({
          timeframe: '5m',
          showHorizontalLevels: true,
          horizontalLevelsTouches: 0,
          horizontalLevelsTouchesThreshold: 0.5,
          horizontalLevelsLivingTime: 0,
          horizontalLevelsPeriod: 20,
          showLimitOrders: true,
          limitOrderFilter: 50_000,
          limitOrderDistance: 5,
          limitOrderLife: 0,
          limitOrderCorrosionTime: 0,
          showTrendLevels: true,
          trendlinesSource: 'high/low',
          trendlinesPeriod: 20,
          volumeFrom: 0,
          volumeTo: 100_000_000_000,
          tradesFrom: 0,
          tradesTo: 0,
          tradesInterval: 'interval_24h',
          correlationFrom: -100,
          correlationTo: 100,
          priceChangeInterval: 'interval_24h',
          priceChangeTo: 0,
          priceChangeFrom: 0,
          volumeInterval: 'interval_24h',
          showOnlyActiveCoins: false,
          showDensitiesWidget: false,
          showActiveCoinTooltips: true,
          correlationInterval: 'interval_24h',
          horizontalLevelsTimeframes: [],
        });

      case 'horizontalLevels':
        return this.chartForm.patchValue({
          showHorizontalLevels: true,
          showDailyHighAndLow: true,
          showActiveCoinTooltips: true,
          horizontalLevelsTouches: 0,
          horizontalLevelsTouchesThreshold: 0.5,
          horizontalLevelsLivingTime: 0,
          horizontalLevelsPeriod: 20,
          candlesLength: 800,
          chartOffset: 50,
          horizontalLevelsTimeframes: [],
          roundHorizontalLevels: false,
        });

      case 'trendLevels':
        return this.chartForm.patchValue({
          showTrendLevels: true,
          trendlinesSource: 'high/low',
          trendlinesPeriod: 20,
        });

      case 'densities':
        return this.chartForm.patchValue({
          showLimitOrders: true,
          limitOrderFilter: 50_000,
          limitOrderDistance: 5,
          limitOrderLife: 0,
          limitOrderCorrosionTime: 0,
          round_density: false,
          showDensitiesWidget: false,
          showLimitOrdersMarker: true,
        });

      case 'filters':
        return this.chartForm.patchValue({
          volumeFrom: 0,
          volumeTo: 100_000_000_000,
          correlationFrom: -100,
          correlationTo: 100,
          volumeInterval: 'interval_24h',
          priceChangeInterval: 'interval_24h',
          priceChangeTo: 0,
          priceChangeFrom: 0,
          tradesFrom: 0,
          tradesTo: 0,
          tradesInterval: 'interval_24h',
          showOnlyActiveCoins: false,
          correlationInterval: 'interval_24h',
        });

      default:
        return void 0;
    }
  }

  private patchValues(): void {
    this.chartForm.patchValue(
      {
        // market: this.chartSettings.market ?? 'BINANCE_SPOT',
        timeframe: this.chartSettings?.timeframe ?? '5m',
        candlesLength: this.chartSettings?.candlesLength ?? 800,
        chartOffset: this.chartSettings?.chartOffset ?? 50,
        showHorizontalLevels:
          !!this.chartSettings?.showHorizontalLevels ?? true,
        horizontalLevelsTouches:
          this.chartSettings?.horizontalLevelsTouches ?? 0,
        horizontalLevelsTouchesThreshold:
          this.chartSettings?.horizontalLevelsTouchesThreshold ?? 0.5,
        horizontalLevelsLivingTime:
          this.chartSettings?.horizontalLevelsLivingTime ?? 0,
        horizontalLevelsPeriod:
          this.chartSettings?.horizontalLevelsPeriod ?? 20,
        showLimitOrders: !!this.chartSettings?.showLimitOrders ?? true,
        showDensitiesWidget: !!this.chartSettings?.showDensitiesWidget ?? true,
        limitOrderFilter: this.chartSettings?.limitOrderFilter ?? 50_000,
        limitOrderDistance: this.chartSettings?.limitOrderDistance ?? 5,
        limitOrderLife: this.chartSettings?.limitOrderLife ?? 0,
        limitOrderCorrosionTime:
          this.chartSettings?.limitOrderCorrosionTime ?? 0,
        round_density: !!this.chartSettings?.round_density ?? false,
        showTrendLevels: !!this.chartSettings?.showTrendLevels ?? true,
        trendlinesSource: this.chartSettings?.trendlinesSource ?? 'high/low',
        trendlinesPeriod: this.chartSettings?.trendlinesPeriod ?? 20,
        volumeFrom: this.chartSettings?.volumeFrom ?? 0,
        volumeTo: this.chartSettings?.volumeTo ?? 100_000_000_000,
        tradesFrom: this.chartSettings?.tradesFrom ?? 0,
        tradesTo: this.chartSettings?.tradesTo ?? 0,
        correlationFrom: this.chartSettings?.correlationFrom ?? -100,
        correlationTo: this.chartSettings?.correlationTo ?? 100,
        volumeInterval: this.chartSettings?.volumeInterval ?? 'interval_24h',
        tradesInterval: this.chartSettings?.tradesInterval ?? 'interval_24h',
        priceChangeFrom: this.chartSettings?.priceChangeFrom ?? 0,
        priceChangeTo: this.chartSettings?.priceChangeTo ?? 0,
        showOnlyActiveCoins: !!this.chartSettings?.showOnlyActiveCoins ?? false,
        showDailyHighAndLow: !!this.chartSettings?.showDailyHighAndLow ?? true,
        horizontalLevelsTimeframes:
          this.chartSettings?.horizontalLevelsTimeframes ?? [],
        correlationInterval:
          this.chartSettings?.correlationInterval ?? 'interval_24h',
        showLimitOrdersMarker:
          !!this.chartSettings?.showLimitOrdersMarker ?? true,
        showActiveCoinTooltips:
          !!this.chartSettings?.showActiveCoinTooltips ?? true,
        roundHorizontalLevels:
          !!this.chartSettings?.roundHorizontalLevels ?? false,
      },
      {
        emitEvent: false,
      },
    );
  }
}
