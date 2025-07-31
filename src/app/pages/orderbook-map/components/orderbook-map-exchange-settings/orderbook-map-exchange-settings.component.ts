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
import {
  OrderbookBigOrderUnit,
  OrderbookMapExchangeSettings,
  OrderbookMapFilterPeriod, SingleDensityPerCoinType,
} from '../../utils/models';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Exchange,
  getMainExchangesData,
} from '../../../../shared/models/Exchange';

import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { convertPrice } from 'src/app/shared/utils/priceConverter';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { debounceTime, Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-orderbook-map-exchange-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    CheckboxModule,
    DropdownModule,
    DividerModule,
    FieldsetModule,
    TranslateModule,
  ],
  templateUrl: './orderbook-map-exchange-settings.component.html',
  styleUrls: ['./orderbook-map-exchange-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderbookMapExchangeSettingsComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input()
  public settings: OrderbookMapExchangeSettings;

  @Output()
  public changeSettings: EventEmitter<OrderbookMapExchangeSettings> =
    new EventEmitter<OrderbookMapExchangeSettings>();

  private subscription: Subscription = new Subscription();

  public exchanges: Exchange[] = getMainExchangesData().map((i) => i.exchange);

  public exchangeSettingsForm: FormGroup = new FormGroup({
    active: new FormControl<boolean>(false),
    volumeFilterIsActive: new FormControl<boolean>(true, Validators.required),
    priceChangeFilterIsActive: new FormControl<boolean>(
      true,
      Validators.required,
    ),
    orderbookBigOrderUnit: new FormControl<OrderbookBigOrderUnit>(
      'corrosion_time',
      Validators.required,
    ),
    limitOrderLife: new FormControl<number>(0, Validators.required),
    ordersMinCorrosionTime: new FormControl<number>(3, Validators.required),
    ordersBigCorrosionTime: new FormControl<number>(20, Validators.required),
    ordersMinSum: new FormControl<number>(300_000, Validators.required),
    round_density: new FormControl<boolean>(false),
    volumeFromFilter: new FormControl<number>(0, Validators.required),
    volumeToFilter: new FormControl<number>(
      100_000_000_000,
      Validators.required,
    ),
    priceChangeFromFilter: new FormControl<number>(0, Validators.required),
    priceChangeToFilter: new FormControl<number>(10_000, Validators.required),
    priceChangeFilterPeriod: new FormControl<OrderbookMapFilterPeriod>(
      '24h',
      Validators.required,
    ),
    volumeFilterPeriod: new FormControl<OrderbookMapFilterPeriod>(
      '24h',
      Validators.required,
    ),
    singleDensityPerCoin: new FormControl<boolean>(false),
    singleDensityPerCoinType: new FormControl<SingleDensityPerCoinType>('distance')
  });

  public filterRangeOptions: { name: string; label: string }[] = [
    { name: '1m', label: this.translateService.instant('depth_map.1m') },
    { name: '3m', label: this.translateService.instant('depth_map.3m') },
    { name: '5m', label: this.translateService.instant('depth_map.5m') },
    { name: '15m', label: this.translateService.instant('depth_map.15m') },
    { name: '30m', label: this.translateService.instant('depth_map.30m') },
    { name: '1h', label: this.translateService.instant('depth_map.1h') },
    { name: '2h', label: this.translateService.instant('depth_map.2h') },
    { name: '6h', label: this.translateService.instant('depth_map.6h') },
    { name: '12h', label: this.translateService.instant('depth_map.12h') },
    { name: '24h', label: this.translateService.instant('depth_map.24h') },
  ];

  public singleDensityPerCoinTypeOptions: { name: SingleDensityPerCoinType; label: string }[] = [
    { name: 'distance', label: this.translateService.instant('depth_map.single_density_per_coin_type_options.distance') },
    { name: 'corrosion_time', label: this.translateService.instant('depth_map.single_density_per_coin_type_options.corrosion_time') },
  ]

  constructor(private translateService: TranslateService) {}

  public ngOnInit() {
    this.prepatchValues();

    this.subscription.add(
      this.exchangeSettingsForm.valueChanges
        // .pipe(debounceTime(1000))
        .subscribe((value) => {
          this.changeSettings.emit(value);
        }),
    );
  }

  public ngOnChanges({ settings }: SimpleChanges) {
    if (settings && !settings.isFirstChange()) {
      this.prepatchValues();
    }
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public toggleExchangeSettings(active: boolean): void {
    this.exchangeSettingsForm.controls['active'].setValue(active);
  }

  private prepatchValues(): void {
    this.exchangeSettingsForm.patchValue(
      {
        active: !!this.settings.active ?? false,
        ordersMinCorrosionTime: this.settings.ordersMinCorrosionTime ?? 3,
        ordersBigCorrosionTime: this.settings.ordersBigCorrosionTime ?? 20,
        ordersMinSum: this.settings.ordersMinSum ?? 300_000,
        volumeFilterIsActive: !!this.settings.volumeFilterIsActive ?? false,
        volumeFromFilter: this.settings.volumeFromFilter ?? 0,
        volumeToFilter: this.settings.volumeToFilter ?? 100_000_000_000,
        volumeFilterPeriod: this.settings.volumeFilterPeriod ?? '24h',
        priceChangeFilterIsActive:
          !!this.settings.priceChangeFilterIsActive ?? false,
        priceChangeFromFilter: this.settings.priceChangeFromFilter ?? 0,
        priceChangeToFilter: this.settings.priceChangeToFilter ?? 10_000,
        priceChangeFilterPeriod: this.settings.priceChangeFilterPeriod ?? '24h',
        limitOrderLife: this.settings.limitOrderLife ?? 0,
        round_density: this.settings.round_density ?? false,
        singleDensityPerCoin: this.settings.singleDensityPerCoin ?? false,
        singleDensityPerCoinType: this.settings.singleDensityPerCoinType ?? 'distance',
      },
      { emitEvent: false },
    );
  }

  protected readonly convertPrice = convertPrice;
}
