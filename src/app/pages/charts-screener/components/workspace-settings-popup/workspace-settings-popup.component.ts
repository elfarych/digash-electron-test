import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IntervalMultiSelectorComponent } from '../../../../shared/components/interval-multi-selector/interval-multi-selector.component';
import { WorkspaceService } from '../../data-access/workspace.service';
import {
  getEmptyWorkspace,
  Workspace,
} from '../../../../shared/models/Workspace';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Exchange } from '../../../../shared/models/Exchange';
import { ExchangeSelectorComponent } from '../../../../shared/components/exchange-selector/exchange-selector.component';
import { CdkListbox } from '@angular/cdk/listbox';
import { getTimeframes, Timeframe } from '../../../../shared/models/Timeframe';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChartFormationsComponent } from './components/chart-formations/chart-formations.component';
import {
  FormationFilterIntervalType,
  Formations,
} from '../../../../shared/models/Formations';
import { MenuTriggerDirective } from '../../../../shared/components/menu/menu-trigger.directive';
import { MenuComponent } from '../../../../shared/components/menu/menu.component';
import {
  SortingTime,
  SortingType,
  SortingTypeRange,
} from '../../../../shared/models/Sorting';
import {
  getReadableSortingName,
  getReadableSortingRangeName,
  getReadableSortingTimeName,
} from '../../../../shared/utils/getReadableSortingName';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { LimitOrderLocation } from '../../../../shared/models/formations/LimitOrderLocation';
import { getReadableLimitOrderLocation } from '../../../../shared/utils/getReadableLimitOrderLocation';
import { ConvertPricePipe } from '../../../../shared/pipes/convert-price.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { ChartIndicatorsComponent } from './components/chart-indicators/chart-indicators.component';
import { ChartTechnicalIndicators } from '../../../../shared/models/chart-indicators/ChartIndicators';
import { getReadableTrendLineSourceName } from '../../../../shared/utils/getReadableTrendLineSourceName';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessagesModule } from 'primeng/messages';
import { PremiumMessageBannerComponent } from '../../../../shared/components/premium-message-banner/premium-message-banner.component';
import {
  ChartSettingsType,
  PriceDirection,
} from '../../../../shared/types/base.types';
import { DefaultSettingsButtonComponent } from '../../../../shared/components/default-settings-button/default-settings-button.component';
import { UserData } from '../../../../shared/models/Auth';
import { BlacklistBuilderComponent } from '../../../../shared/components/blacklist-builder/blacklist-builder.component';
import { PanelModule } from 'primeng/panel';
import { AppIntervalSelectorComponent } from '../../../../shared/components/interval-selector/interval-selector.component';
import { TooltipsComponent } from '../../../../shared/components/tooltips/tooltips.component';
import { DividerModule } from 'primeng/divider';
import { getVolumeSplashTooltip } from '../../../../shared/utils/volumeSplashTooltip';
import { getNatrTooltip } from '../../../../shared/utils/natrTooltip';
import { AlertPriceChangeTypeOptions } from '../../../../shared/models/Alert';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ExcludeExchangesComponent } from '../../../../shared/components/exclude-exchanges/exclude-exchanges.component';
import { ConvertBigNumberPipe } from '../../../../shared/pipes/convert-big-number.pipe';

@Component({
  selector: 'app-workspace-settings-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressSpinnerComponent,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    ExchangeSelectorComponent,
    CdkListbox,
    MatButtonToggleModule,
    ChartFormationsComponent,
    MenuTriggerDirective,
    MenuComponent,
    MatCheckboxModule,
    MatSliderModule,
    ConvertPricePipe,
    MatTooltipModule,
    MatDialogModule,
    ChartIndicatorsComponent,
    StepsModule,
    ButtonModule,
    InputTextModule,
    SliderModule,
    InputNumberModule,
    DropdownModule,
    TabViewModule,
    CheckboxModule,
    SelectButtonModule,
    MessagesModule,
    PremiumMessageBannerComponent,
    DefaultSettingsButtonComponent,
    BlacklistBuilderComponent,
    PanelModule,
    AppIntervalSelectorComponent,
    TooltipsComponent,
    DividerModule,
    TranslateModule,
    IntervalMultiSelectorComponent,
    ExcludeExchangesComponent,
    ConvertBigNumberPipe,
  ],
  templateUrl: './workspace-settings-popup.component.html',
  styleUrls: ['./workspace-settings-popup.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceSettingsPopupComponent implements OnInit {
  public loading$: Observable<boolean> = this.service.getCreationInProgress();
  private userData$: Observable<UserData> = this.service.userData$;

  public mainSectionOnFocus: boolean = false;
  public secondSectionOnFocus: boolean = false;
  public blacklist: string[] = [];
  public excludedExchanges: Exchange[] = [];
  public exchangeCoins: { symbol: string }[] = [];
  public indicatorsForm: ChartTechnicalIndicators[];

  public timeframes = getTimeframes(this.translateService);
  public mainInformationFormTouched = false;

  public activeIndex = 0;
  public chartSettingsTabActiveIndex = 0;
  public stepWithErrors: number[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public translateService: TranslateService,
    @Inject(DynamicDialogConfig)
    public data: { data: { data: Workspace; edit: boolean; premium: boolean } },
    private service: WorkspaceService,
    private cdr: ChangeDetectorRef,
  ) {
    this.sortingUpdateTimeOptions = [
      {
        name: 'realtime',
        label: `${this.translateService.instant('sorting.realtime')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
        isDisable: !this.data?.data?.premium,
      },
      {
        name: '30s',
        label: `${this.translateService.instant('sorting.every30s')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
        isDisable: !this.data?.data?.premium,
      },
      {
        name: '1m',
        label: `${this.translateService.instant('sorting.every1m')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
        isDisable: !this.data?.data?.premium,
      },
      {
        name: '5m',
        label: this.translateService.instant('sorting.every5m'),
      },
      {
        name: 'manual',
        label: this.translateService.instant('sorting.manual'),
      },
    ];
  }

  public mainInformationForm: FormGroup = new FormGroup({
    id: new FormControl(),
    title: new FormControl('', [
      Validators.minLength(0),
      Validators.maxLength(100),
      Validators.required,
    ]),
    market: new FormControl<Exchange>('BINANCE_SPOT', [Validators.required]),
  });

  public formationForm: FormGroup = new FormGroup({
    formation: new FormControl<Formations>('None', [Validators.required]),
    formationLevelTouches: new FormControl<number>(0, [
      Validators.min(0),
      Validators.max(3),
    ]),
    formationLimitOrderLevelDistance: new FormControl<number>(0.5),
    formationLevelTouchesThreshold: new FormControl<number>(0.5),
    showOnlyFormations: new FormControl<boolean>(false),
    sortByFormations: new FormControl<boolean>(false),
    formationLimitOrderLevelLocation: new FormControl<LimitOrderLocation>(
      'none',
    ),
  });

  public filterForm: FormGroup = new FormGroup({
    volumeFrom: new FormControl(100_000, [
      Validators.min(0),
      Validators.max(5_000_000_000),
      Validators.required,
    ]),
    volumeTo: new FormControl(100_000_000_000, [
      Validators.min(0),
      Validators.max(100_000_000_000),
      Validators.required,
    ]),
    volumeInterval: new FormControl('interval_24h', [Validators.required]),

    correlationFrom: new FormControl(-100, [
      Validators.min(-100),
      Validators.max(100),
      Validators.required,
    ]),
    correlationTo: new FormControl(100, [
      Validators.min(-100),
      Validators.max(100),
      Validators.required,
    ]),
    correlationInterval: new FormControl('interval_24h', [Validators.required]),

    priceChangeFrom: new FormControl(0, [
      Validators.min(-100),
      Validators.max(10000),
    ]),
    priceChangeTo: new FormControl(1000, [Validators.max(10000)]),
    priceChangeInterval: new FormControl('interval_24h', [Validators.required]),

    tradesFrom: new FormControl(0, [
      Validators.min(0),
      Validators.max(5_000_000_000),
      Validators.required,
    ]),
    tradesTo: new FormControl(0, [
      Validators.min(0),
      Validators.max(100_000_000_000),
      Validators.required,
    ]),
    tradesInterval: new FormControl('interval_24h', [Validators.required]),
  });

  public chartForm: FormGroup = new FormGroup({
    timeframe: new FormControl<Timeframe>('5m', [Validators.required]),
    showDailyHighAndLow: new FormControl(true),
    showLimitOrders: new FormControl(true),
    showHorizontalLevels: new FormControl(true),
    showTrendLevels: new FormControl(true),
    showActiveCoinTooltips: new FormControl(false),
    roundHorizontalLevels: new FormControl(false),
    horizontalLevelsTouchesThreshold: new FormControl(0.5),
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
      Validators.max(100000),
      Validators.required,
    ]),
    horizontalLevelsPeriod: new FormControl(20, Validators.min(10)),
    limitOrderFilter: new FormControl(0, [
      Validators.min(0),
      Validators.max(10_000_000),
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
    round_density: new FormControl(false),
    horizontalLevelsTimeframes: new FormControl<Timeframe[]>([]),
    limitOrderCorrosionTime: new FormControl(0, [Validators.min(0)]),
    trendlinesSource: new FormControl<'high/low' | 'close'>('high/low'),
    trendlinesPeriod: new FormControl(20, Validators.min(10)),
  });

  public sortingInformationForm: FormGroup = new FormGroup({
    sortingType: new FormControl<SortingType>('alphabetically', [
      Validators.required,
    ]),
    sortingTypeRange: new FormControl<SortingTypeRange>('24h', []),
    sortingTime: new FormControl<SortingTime>('manual'),
    showOnlyWatchlistCoins: new FormControl<boolean>(false),
    sortByAlerts: new FormControl<boolean>(false),
    showOnlyCoinsWithAlerts: new FormControl<boolean>(false),
    filterVolumeSplash: new FormControl<boolean>(false),
    filterVolumeSplashValue: new FormControl<number>(2, [Validators.min(2)]),
    filterVolumeSplashPriceChange: new FormControl<boolean>(false),
    filterVolumeSplashPriceChangeValue: new FormControl<number>(0, [
      Validators.min(0),
    ]),
    filterVolumeSplashDirection: new FormControl<PriceDirection>('ALL'),
    filterNatr: new FormControl<boolean>(false),
    filterNatrValue: new FormControl<number>(0.1, [Validators.min(0.1)]),
  });

  public priceDirectionOptions = [
    {
      value: 'UP',
      label: this.translateService.instant('workspace.priceDirection.increase'),
    },
    {
      value: 'DOWN',
      label: this.translateService.instant('workspace.priceDirection.decrease'),
    },
    {
      value: 'ALL',
      label: this.translateService.instant('workspace.priceDirection.all'),
    },
  ];

  public steps = [
    {
      label: this.translateService.instant('workspace.steps.start'),
    },
    {
      label: this.translateService.instant('workspace.steps.formation'),
    },
    {
      label: this.translateService.instant('workspace.steps.filters'),
    },
    {
      label: this.translateService.instant('workspace.steps.sorting'),
    },
    {
      label: this.translateService.instant('workspace.steps.chart'),
    },
    {
      label: this.translateService.instant('workspace.steps.indicators'),
    },
  ];

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

  public formationLimitOrderLevelLocations: { name: string; label: string }[] =
    [
      {
        name: 'up',
        label: this.translateService.instant('workspace.formationLimit.up'),
      },
      {
        name: 'down',
        label: this.translateService.instant('workspace.formationLimit.down'),
      },
      {
        name: 'same',
        label: this.translateService.instant('workspace.formationLimit.same'),
      },
      {
        name: 'none',
        label: this.translateService.instant('workspace.formationLimit.none'),
      },
    ];

  public sortingOptions: {
    name: string;
    label: string;
    isDisable?: boolean;
  }[] = [];

  public sortingRangeOptions: {
    name: string;
    label: string;
    isDisable?: boolean;
  }[] = [
    {
      name: '1m',
      label: `${this.translateService.instant('workspace.sortingRange.last1Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '3m',
      label: `${this.translateService.instant('workspace.sortingRange.last3Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '5m',
      label: `${this.translateService.instant('workspace.sortingRange.last5Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '15m',
      label: `${this.translateService.instant('workspace.sortingRange.last15Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '30m',
      label: `${this.translateService.instant('workspace.sortingRange.last30Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '1h',
      label: `${this.translateService.instant('workspace.sortingRange.last1Hour')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '2h',
      label: `${this.translateService.instant('workspace.sortingRange.last2Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '6h',
      label: `${this.translateService.instant('workspace.sortingRange.last6Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '12h',
      label: `${this.translateService.instant('workspace.sortingRange.last12Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '24h',
      label: this.translateService.instant(
        'workspace.sortingRange.last24Hours',
      ),
    },
  ];

  public volumeSplashSortingRangeOptions: {
    name: string;
    label: string;
    isDisable?: boolean;
  }[] = [
    {
      name: '5m',
      label: `${this.translateService.instant('workspace.volumeSplash.last5Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '10m',
      label: `${this.translateService.instant('workspace.volumeSplash.last10Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '15m',
      label: `${this.translateService.instant('workspace.volumeSplash.last15Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '20m',
      label: `${this.translateService.instant('workspace.volumeSplash.last20Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '30m',
      label: `${this.translateService.instant('workspace.volumeSplash.last30Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '1h',
      label: `${this.translateService.instant('workspace.volumeSplash.last1Hour')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '2h',
      label: `${this.translateService.instant('workspace.volumeSplash.last2Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '6h',
      label: `${this.translateService.instant('workspace.volumeSplash.last6Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '12h',
      label: `${this.translateService.instant('workspace.volumeSplash.last12Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '24h',
      label: this.translateService.instant(
        'workspace.volumeSplash.last24Hours',
      ),
    },
  ];
  public natrSortingRangeOptions: {
    name: string;
    label: string;
    isDisable?: boolean;
  }[] = [
    {
      name: '2m',
      label: `${this.translateService.instant('workspace.natr.last2Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '5m',
      label: `${this.translateService.instant('workspace.natr.last5Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '10m',
      label: `${this.translateService.instant('workspace.natr.last10Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '15m',
      label: `${this.translateService.instant('workspace.natr.last15Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '20m',
      label: `${this.translateService.instant('workspace.natr.last20Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '30m',
      label: `${this.translateService.instant('workspace.natr.last30Min')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '1h',
      label: `${this.translateService.instant('workspace.natr.last1Hour')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '2h',
      label: `${this.translateService.instant('workspace.natr.last2Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '4h',
      label: `${this.translateService.instant('workspace.natr.last4Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '6h',
      label: `${this.translateService.instant('workspace.natr.last6Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '12h',
      label: `${this.translateService.instant('workspace.natr.last12Hours')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
      isDisable: !this.data?.data?.premium,
    },
    {
      name: '24h',
      label: this.translateService.instant('workspace.natr.last24Hours'),
    },
  ];

  public sortingUpdateTimeOptions: {
    name: string;
    label: string;
    isDisable?: boolean;
  }[] = [];

  public ngOnInit(): void {
    if (this.data?.data?.edit) {
      this.prePatchValues();
      this.getExchangeCoins(this.data.data.data.market);
    } else {
      this.getExchangeCoins('BINANCE_SPOT');
    }
    if (window.innerWidth <= 1024) {
      this.mainSectionOnFocus = true;
      this.secondSectionOnFocus = true;
    }

    this.sortingUpdateTimeOptions = [
      {
        name: 'realtime',
        label: `${this.translateService.instant('sorting.realtime')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
        isDisable: !this.data?.data?.premium,
      },
      {
        name: '30s',
        label: `${this.translateService.instant('sorting.every30s')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
        isDisable: !this.data?.data?.premium,
      },
      {
        name: '1m',
        label: `${this.translateService.instant('sorting.every1m')} ${!this.data?.data?.premium ? this.translateService.instant('sorting.premiumSuffix') : ''}`,
        isDisable: !this.data?.data?.premium,
      },
      {
        name: '5m',
        label: this.translateService.instant('sorting.every5m'),
      },
      {
        name: 'manual',
        label: this.translateService.instant('sorting.manual'),
      },
    ];
    this.sortingOptions = [
      {
        name: 'alphabetically',
        label: this.translateService.instant('sorting.alphabetically'),
      },
      {
        name: 'volatility',
        label: this.translateService.instant('sorting.volatility'),
      },
      {
        name: 'correlation',
        label: this.translateService.instant('sorting.correlation'),
      },
      {
        name: 'volume',
        label: this.translateService.instant('sorting.volume'),
      },
      {
        name: 'trades',
        label: this.translateService.instant('sorting.trades'),
      },
      {
        name: 'topGainers',
        label: this.translateService.instant('sorting.topGainers'),
      },
      {
        name: 'topLosers',
        label: this.translateService.instant('sorting.topLosers'),
      },
      {
        name: 'volumeSplash',
        label: this.translateService.instant('sorting.volumeSplash'),
        isDisable: !this.data?.data?.premium,
      },
      { name: 'natr', label: this.translateService.instant('sorting.natr') },
      {
        name: 'watchlist',
        label: this.translateService.instant('sorting.watchlist'),
      },
      { name: 'coin', label: this.translateService.instant('sorting.coin') },
    ];
  }

  public handleBlacklistSelectCoin(coin: string): void {
    const index = this.blacklist.indexOf(coin);
    if (index === -1) {
      this.blacklist.push(coin);
    } else {
      this.blacklist.splice(index, 1);
    }
  }

  public handleExcludeExchanges(exchanges: Exchange[]): void {
    this.excludedExchanges = exchanges;
    this.cdr.detectChanges();
  }

  public goToDensitySettings(): void {
    this.activeIndex = 4;
    this.chartSettingsTabActiveIndex = 2;
  }

  public goToChartLevelsSettings(formation: Formations): void {
    if (formation === 'HorizontalLevels') {
      this.activeIndex = 4;
      this.chartSettingsTabActiveIndex = 0;
    }
    if (formation === 'TrendLevels') {
      this.activeIndex = 4;
      this.chartSettingsTabActiveIndex = 1;
    }
  }

  public changeMainSectionFocus(value: boolean): void {
    if (window.innerWidth > 1024) {
      this.mainSectionOnFocus = value;
    }
  }

  public changeSecondSectionFocus(value: boolean): void {
    if (window.innerWidth > 1024) {
      this.secondSectionOnFocus = value;
    }
  }

  public intervalChange(
    interval: FormationFilterIntervalType,
    form: FormGroup,
    formField: string,
  ): void {
    form.get(formField).setValue(interval);
  }

  public onActiveIndexChange(index: number) {
    this.activeIndex = index;
  }

  public onSortingOptionsChange(event: DropdownChangeEvent): void {
    if (event.value === 'volumeSplash' || event.value === 'natr') {
      this.sortingInformationForm.get('sortingTypeRange').setValue('24h');
    }

    if (event.value === 'volumeSplash' && !this.data?.data?.premium) {
      this.sortingInformationForm.get('sortingType').setValue('alphabetically');
    }
  }

  public exchangeChange(exchange: Exchange): void {
    this.mainInformationForm.get('market').setValue(exchange);
    // this.getExchangeCoins(exchange);
  }

  public updateIndicatorsData(data: ChartTechnicalIndicators[]): void {
    this.indicatorsForm = data;
  }

  public timeframeChange(value: Timeframe): void {
    this.chartForm.get('timeframe').setValue(value);
  }

  public formationChange(value: Formations): void {
    this.formationForm.get('formation').setValue(value);
  }

  public getSortingTypeRangeOptions(): { name: string; label: string }[] {
    const sortingType: SortingType =
      this.sortingInformationForm.get('sortingType').value;
    if (sortingType === 'volumeSplash') {
      return this.volumeSplashSortingRangeOptions;
    }
    if (sortingType === 'natr') {
      return this.natrSortingRangeOptions;
    }

    return this.sortingRangeOptions;
  }

  public getSortingTypeRangeSectionClass(): string {
    const sortingType: SortingType =
      this.sortingInformationForm.get('sortingType').value;
    if (sortingType === 'volumeSplash' || sortingType === 'natr') {
      return 'form-control-grid digash-form-control';
    }
    return 'digash-form-control';
  }

  public formationLimitOrderLocationChange(
    value: LimitOrderLocation,
    menu: MenuComponent,
  ): void {
    menu.close();
    this.formationForm.get('formationLimitOrderLevelLocation').setValue(value);
  }

  public sortingChange(value: SortingType, menu: MenuComponent): void {
    menu.close();
    this.sortingInformationForm.get('sortingType').setValue(value);
  }

  public sortingRangeChange(
    value: SortingTypeRange,
    menu: MenuComponent,
  ): void {
    menu.close();
    this.sortingInformationForm.get('sortingTypeRange').setValue(value);
  }

  public sortingTimeChange(value: SortingTime, menu: MenuComponent): void {
    menu.close();
    this.sortingInformationForm.get('sortingTime').setValue(value);
  }

  public trendLineSourceChange(
    value: 'high/low' | 'close',
    menu: MenuComponent,
  ): void {
    menu.close();
    this.chartForm.get('trendlinesSource').setValue(value);
  }

  public volumeFilterSliderChange(value: number): void {
    this.mainInformationForm.get('volumeFilter').setValue(value);
  }

  public volumeFilterToSliderChange(value: number): void {
    this.mainInformationForm.get('volumeFilterTo').setValue(value);
  }

  public getReadableLimitOrderLocation(location: LimitOrderLocation): string {
    return getReadableLimitOrderLocation(location);
  }

  public getReadableSortingName(value: SortingType): string {
    return getReadableSortingName(value, this.translateService);
  }

  public getReadableSortingRangeName(value: SortingTypeRange): string {
    return getReadableSortingRangeName(value, this.translateService);
  }

  public getReadableSortingTimeName(value: SortingTime): string {
    return getReadableSortingTimeName(value, this.translateService);
  }

  public getReadableTrendLineSourceName(value: 'high/low' | 'close'): string {
    return getReadableTrendLineSourceName(value);
  }

  public close(): void {
    this.ref.close();
  }

  public save(): void {
    this.mainInformationFormTouched = true;
    this.stepWithErrors = [];

    if (!this.mainInformationForm.valid) {
      this.stepWithErrors.push(0);
      return void 0;
    }

    if (!this.formationForm.valid) {
      this.stepWithErrors.push(1);
      return void 0;
    }

    if (!this.filterForm.valid) {
      this.stepWithErrors.push(2);
      return void 0;
    }

    if (!this.sortingInformationForm.valid) {
      this.stepWithErrors.push(3);
      return void 0;
    }

    if (!this.chartForm.valid) {
      this.stepWithErrors.push(4);
      return void 0;
    }

    const data: Workspace = this.getFormData();
    this.data?.data?.edit
      ? this.service.initWorkspaceEdit({
          ...data,
          blacklist: this.blacklist,
          excluded_markets: this.excludedExchanges,
        })
      : this.service.initWorkspaceCreation({
          ...data,
          blacklist: this.blacklist,
          excluded_markets: this.excludedExchanges,
        });
  }

  public setDefaultChartSettings(type: ChartSettingsType): void {
    switch (type) {
      case 'all':
        return this.chartForm.patchValue({
          timeframe: '5m',
          showDailyHighAndLow: true,
          showHorizontalLevels: true,
          horizontalLevelsTouches: 0,
          horizontalLevelsTouchesThreshold: 0.5,
          horizontalLevelsLivingTime: 0,
          horizontalLevelsPeriod: 20,
          showLimitOrders: true,
          showTrendLevels: true,
          limitOrderFilter: 50_000,
          limitOrderDistance: 5,
          limitOrderLife: 0,
          limitOrderCorrosionTime: 0,
          trendlinesSource: 'high/low',
          trendlinesPeriod: 20,
          candlesLength: 400,
          chartOffset: 50,
          horizontalLevelsTimeframes: [],
        });

      case 'horizontalLevels':
        return this.chartForm.patchValue({
          showHorizontalLevels: true,
          showDailyHighAndLow: true,
          roundHorizontalLevels: false,
          horizontalLevelsTouches: 0,
          horizontalLevelsTouchesThreshold: 0.5,
          horizontalLevelsLivingTime: 0,
          horizontalLevelsPeriod: 20,
          candlesLength: 400,
          chartOffset: 50,
          horizontalLevelsTimeframes: [],
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
        });

      default:
        return void 0;
    }
  }

  private async getExchangeCoins(exchange: Exchange): Promise<void> {
    this.exchangeCoins = await firstValueFrom(
      this.service
        .getExchangeCoins(exchange)
        .pipe(map((c) => c.map((i) => ({ symbol: i })))),
    );
    this.cdr.detectChanges();
  }

  private getFormData(): Workspace {
    const resultForm: Workspace = getEmptyWorkspace();

    for (const [key, value] of Object.entries(
      this.mainInformationForm.getRawValue(),
    )) {
      resultForm[key] = isNaN(value as any) ? value : +value;
    }

    for (const [key, value] of Object.entries(this.chartForm.getRawValue())) {
      resultForm[key] = isNaN(value as any) ? value : +value;
    }

    for (const [key, value] of Object.entries(this.filterForm.getRawValue())) {
      resultForm[key] = isNaN(value as any) ? value : +value;
    }

    for (const [key, value] of Object.entries(
      this.formationForm.getRawValue(),
    )) {
      resultForm[key] = isNaN(value as any) ? value : +value;
    }

    for (const [key, value] of Object.entries(
      this.sortingInformationForm.getRawValue(),
    )) {
      resultForm[key] = isNaN(value as any) ? value : +value;
    }

    resultForm.technicalIndicators = this.indicatorsForm;
    return resultForm;
  }

  private prePatchValues(): void {
    const workspace: Workspace = this.data.data?.data;
    if (workspace.blacklist) {
      this.blacklist = JSON.parse(JSON.stringify(workspace.blacklist));
    }

    if (workspace.excluded_markets) {
      this.excludedExchanges = JSON.parse(
        JSON.stringify(workspace.excluded_markets),
      );
    }

    this.mainInformationForm.patchValue({
      id: workspace.id ?? undefined,
      title: workspace.title ?? '',
      market: workspace.market ?? 'BINANCE_SPOT',
    });

    this.formationForm.patchValue({
      formation: workspace.formation ?? 'None',
      formationLimitOrderLevelLocation:
        workspace.formationLimitOrderLevelLocation ?? 'none',
      formationLimitOrderLevelDistance:
        workspace.formationLimitOrderLevelDistance ?? 0.5,
      formationLevelTouches: workspace.formationLevelTouches ?? 0,
      formationLevelTouchesThreshold:
        workspace.formationLevelTouchesThreshold ?? 0.5,
      showOnlyFormations: !!workspace.showOnlyFormations,
      sortByFormations: !!workspace.sortByFormations,
    });

    this.filterForm.patchValue({
      volumeFrom: workspace.volumeFrom ?? 100_000,
      volumeTo: workspace.volumeTo ?? 100_000_000_000,
      volumeInterval: workspace.volumeInterval ?? 'interval_24h',

      priceChangeFrom: workspace.priceChangeFrom ?? -100,
      priceChangeTo: workspace.priceChangeTo ?? 1000,
      priceChangeInterval: workspace.priceChangeInterval ?? 'interval_24h',

      correlationFrom: workspace.correlationFrom ?? -100,
      correlationTo: workspace.correlationTo ?? 100,
      correlationInterval: workspace.correlationInterval ?? 'interval_24h',

      tradesFrom: workspace.tradesFrom ?? 0,
      tradesTo: workspace.tradesTo ?? 0,
      tradesInterval: workspace.tradesInterval ?? 'interval_24h',
    });

    this.chartForm.patchValue({
      timeframe: workspace.timeframe ?? '5m',
      showDailyHighAndLow: !!workspace.showDailyHighAndLow,
      showHorizontalLevels: !!workspace.showHorizontalLevels,
      horizontalLevelsTouches: workspace.horizontalLevelsTouches ?? 0,
      horizontalLevelsTouchesThreshold:
        workspace.horizontalLevelsTouchesThreshold ?? 0.5,
      horizontalLevelsLivingTime: workspace.horizontalLevelsLivingTime ?? 0,
      horizontalLevelsPeriod: workspace.horizontalLevelsPeriod ?? 20,
      showLimitOrders: !!workspace.showLimitOrders,
      showTrendLevels: !!workspace.showTrendLevels,
      round_density: !!workspace.round_density,
      limitOrderFilter: workspace.limitOrderFilter ?? 50_000,
      limitOrderDistance: workspace.limitOrderDistance ?? 5,
      limitOrderLife: workspace.limitOrderLife ?? 0,
      limitOrderCorrosionTime: workspace.limitOrderCorrosionTime ?? 0,
      trendlinesSource: workspace.trendlinesSource ?? 'high/low',
      trendlinesPeriod: workspace.trendlinesPeriod ?? 20,
      candlesLength: workspace.candlesLength ?? 400,
      chartOffset: workspace.chartOffset ?? 50,
      showActiveCoinTooltips: !!workspace.showActiveCoinTooltips ?? true,
      roundHorizontalLevels: !!workspace.roundHorizontalLevels ?? false,
      horizontalLevelsTimeframes: workspace.horizontalLevelsTimeframes ?? [],
    });

    this.sortingInformationForm.patchValue({
      sortingType: workspace.sortingType ?? 'alphabetically',
      sortingTypeRange: workspace.sortingTypeRange ?? '24h',
      sortingTime: workspace.sortingTime ?? 'manual',
      sortByAlerts: !!workspace.sortByAlerts,
      showOnlyWatchlistCoins: !!workspace.showOnlyWatchlistCoins,
      showOnlyCoinsWithAlerts: !!workspace.showOnlyCoinsWithAlerts,
      filterVolumeSplash: !!workspace.filterVolumeSplash,
      filterVolumeSplashValue: workspace.filterVolumeSplashValue ?? 2,
      filterVolumeSplashDirection:
        workspace.filterVolumeSplashDirection ?? 'ALL',
      filterNatr: !!workspace.filterNatr,
      filterNatrValue: workspace.filterNatrValue ?? 0.1,
      filterVolumeSplashPriceChangeValue:
        workspace.filterVolumeSplashPriceChangeValue ?? 0,
      filterVolumeSplashPriceChange:
        workspace.filterVolumeSplashPriceChange ?? false,
    });

    this.indicatorsForm = workspace.technicalIndicators;
  }

  protected readonly getVolumeSplashTooltip = getVolumeSplashTooltip;
  protected readonly getNatrTooltip = getNatrTooltip;
  protected readonly alertPriceChangeTypeOptions = AlertPriceChangeTypeOptions(
    this.translateService,
  );
}
