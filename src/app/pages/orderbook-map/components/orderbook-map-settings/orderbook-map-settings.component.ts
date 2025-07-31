import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import {
  OrderbookMapDataLoaderMode,
  OrderbookMapExchangeSettings,
  OrderBookMapOrdersDirection,
  OrderbookMapSettings,
} from '../../utils/models';
import { TabViewModule } from 'primeng/tabview';
import {
  Exchange,
  ExchangeData,
  getMainExchangesData,
} from '../../../../shared/models/Exchange';
import { SvgIconComponent } from 'angular-svg-icon';
import { PanelModule } from 'primeng/panel';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  getOrderbookMapDefaultSettings,
  initialOrderbookMapExchangesDefaultSettings,
} from '../../utils/defaultSettings';
import { DropdownOptions } from '../../../../shared/types/base.types';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { BlacklistBuilderComponent } from '../../../../shared/components/blacklist-builder/blacklist-builder.component';
import { getTimeframes, Timeframe } from '../../../../shared/models/Timeframe';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { isMobileDevice } from '../../../../shared/utils/device';
import { OrderbookMapExchangeSettingsComponent } from '../orderbook-map-exchange-settings/orderbook-map-exchange-settings.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-orderbook-map-settings',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TabViewModule,
    SvgIconComponent,
    PanelModule,
    ReactiveFormsModule,
    DropdownModule,
    InputNumberModule,
    TooltipModule,
    BlacklistBuilderComponent,
    SelectButtonModule,
    ScrollPanelModule,
    CheckboxModule,
    DividerModule,
    OrderbookMapExchangeSettingsComponent,
    TranslateModule,
  ],
  templateUrl: './orderbook-map-settings.component.html',
  styleUrls: ['./orderbook-map-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderbookMapSettingsComponent
  implements OnInit, OnDestroy, OnChanges
{
  protected readonly PrimeIcons = PrimeIcons;

  @Input()
  public settings: OrderbookMapSettings;

  @Input()
  public coins: { symbol: string }[] = [];

  @Output()
  public changeSettings: EventEmitter<OrderbookMapSettings> =
    new EventEmitter<OrderbookMapSettings>();

  @ViewChild(OrderbookMapExchangeSettingsComponent)
  public settingsComponent: OrderbookMapExchangeSettingsComponent;

  public dialogVisible: boolean = false;
  public formTouched: boolean = false;
  public activeTabIndex: number = 0;
  public exchanges: ExchangeData[] = getMainExchangesData();

  public localSettings: OrderbookMapSettings;

  public dataLoaderOptions: DropdownOptions<OrderbookMapDataLoaderMode> = [
    { label: this.translateService.instant('depth_map.auto'), value: 'auto' },
    {
      label: this.translateService.instant('depth_map.manual'),
      value: 'manual',
    },
  ];

  public ordersDirectionOptions: DropdownOptions<OrderBookMapOrdersDirection> =
    [
      {
        label: this.translateService.instant('depth_map.allOrders'),
        value: 'all',
      },
      {
        label: this.translateService.instant('depth_map.onlyBuyOrders'),
        value: 'buy',
      },
      {
        label: this.translateService.instant('depth_map.onlySellOrders'),
        value: 'sell',
      },
    ];

  public settingsForm: FormGroup = new FormGroup({
    askOrdersColor: new FormControl<string>(''),
    bidOrdersColor: new FormControl<string>(''),
    loaderMode: new FormControl<OrderbookMapDataLoaderMode>('auto'),
    chartTimeframe: new FormControl<Timeframe>('5m'),
    loaderIntervalSec: new FormControl<number>(10, [Validators.min(5)]),

    showExchange: new FormControl<boolean>(true),
    showDistance: new FormControl<boolean>(true),
    showCorrosionTime: new FormControl<boolean>(false),
    showOrderSum: new FormControl<boolean>(false),
    openChartOnHover: new FormControl<boolean>(true),
    maxOrdersToShow: new FormControl<number>(40),
    maxOrdersDistance: new FormControl<number>(5),
    chartCandlesLength: new FormControl<number>(550),
    ordersDirection: new FormControl<OrderBookMapOrdersDirection>('all'),

    displayLargeCirce: new FormControl<boolean>(true),
    largeCircleDistance: new FormControl<number>(3),
    displaySmallCircle: new FormControl<boolean>(true),
    smallCircleDistance: new FormControl<number>(1),
  });

  public timeframes = getTimeframes(this.translateService);

  private subscriptions: Subscription = new Subscription();

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.localSettings = JSON.parse(JSON.stringify(this.settings));
    this.prepatchSettingsFormValues();
  }

  public ngOnChanges({ settings }: SimpleChanges) {
    if (settings) {
      this.localSettings = JSON.parse(JSON.stringify(this.settings));
      if (!settings.isFirstChange()) {
        this.prepatchSettingsFormValues();
      }
    }
  }

  public activateExchange(event: MouseEvent, exchangeData: ExchangeData): void {
    const exchangeName = exchangeData.exchange;

    if (!this.localSettings.exchangesSettings[exchangeName]) {
      this.localSettings.exchangesSettings[exchangeName] =
        initialOrderbookMapExchangesDefaultSettings;
    }

    const active = !this.localSettings.exchangesSettings[exchangeName].active;

    this.localSettings.exchangesSettings[exchangeName] = {
      ...this.localSettings.exchangesSettings[exchangeName],
      active,
    };
  }

  public changeActiveTab(event: MouseEvent, index: number): void {
    this.activeTabIndex = index;
    this.cdr.detectChanges();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public openSettings(): void {
    this.dialogVisible = true;
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.code.toLowerCase() === 'keys') {
      this.openSettings();
    }
  }

  public save(): void {
    this.formTouched = true;

    if (!this.settingsForm.valid) {
      return void 0;
    }

    this.changeSettings.emit({
      ...this.localSettings,
      ...this.settingsForm.getRawValue(),
    });

    this.dialogVisible = false;
  }

  public close(): void {
    this.localSettings = JSON.parse(JSON.stringify(this.settings));
    this.dialogVisible = false;
  }

  public resetSettings(): void {
    this.changeSettings.emit(getOrderbookMapDefaultSettings());
  }

  public selectBlacklistCoin(coin: string): void {
    const blacklist = JSON.parse(JSON.stringify(this.settings.blacklist || []));
    const index = blacklist.indexOf(coin);
    if (index === -1) {
      blacklist.push(coin);
    } else {
      blacklist.splice(index, 1);
    }
    this.changeSettings.emit({ ...this.localSettings, blacklist });
  }

  public updateExchangeSettings(
    exchange: Exchange,
    settings: OrderbookMapExchangeSettings,
  ): void {
    this.localSettings.exchangesSettings[exchange] = settings;
  }

  private prepatchSettingsFormValues(): void {
    const defaults: OrderbookMapSettings = getOrderbookMapDefaultSettings();
    this.settingsForm.patchValue(
      {
        askOrdersColor: this.settings.askOrdersColor ?? defaults.askOrdersColor,
        bidOrdersColor: this.settings.bidOrdersColor ?? defaults.bidOrdersColor,
        loaderMode: this.settings.loaderMode ?? defaults.loaderMode,
        maxOrdersToShow:
          this.settings.maxOrdersToShow ?? defaults.maxOrdersToShow,
        chartTimeframe: this.settings.chartTimeframe ?? defaults.chartTimeframe,
        loaderIntervalSec:
          this.settings.loaderIntervalSec ?? defaults.loaderIntervalSec,

        showExchange: !!this.settings.showExchange ?? defaults.showExchange,
        openChartOnHover:
          'openChartOnHover' in this.settings
            ? !!this.settings.openChartOnHover
            : defaults.openChartOnHover,
        showDistance: !!this.settings.showDistance ?? defaults.showDistance,
        showCorrosionTime:
          !!this.settings.showCorrosionTime ?? defaults.showCorrosionTime,
        showOrderSum: !!this.settings.showOrderSum ?? defaults.showOrderSum,
        maxOrdersDistance:
          this.settings.maxOrdersDistance ?? defaults.maxOrdersDistance,
        ordersDirection:
          this.settings.ordersDirection ?? defaults.ordersDirection,
        chartCandlesLength:
          this.settings.chartCandlesLength ?? defaults.chartCandlesLength,

        displayLargeCirce:
          this.settings.displayLargeCirce ?? defaults.displayLargeCirce,
        largeCircleDistance:
          this.settings.largeCircleDistance ?? defaults.largeCircleDistance,
        displaySmallCircle:
          this.settings.displaySmallCircle ?? defaults.displaySmallCircle,
        smallCircleDistance:
          this.settings.smallCircleDistance ?? defaults.smallCircleDistance,
      },
      { emitEvent: false },
    );
  }

  protected readonly isMobileDevice = isMobileDevice;
  protected readonly Number = Number;
}
