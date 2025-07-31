import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DepthMapExchangeSettings,
  DepthMapFilterPeriod,
  DepthMapSettings,
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
import {
  defaultLargeDepthMapOrderFilterValues,
  defaultMediumDepthMapOrderFilterValues,
  defaultSmallDepthMapOrderFilterValues,
} from '../../utils/defaultSettings';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { convertPrice } from 'src/app/shared/utils/priceConverter';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { debounceTime, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-depth-map-exchange-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    CheckboxModule,
    DropdownModule,
    DividerModule,
    FieldsetModule,
    TranslateModule
  ],
  templateUrl: './depth-map-exchange-settings.component.html',
  styleUrls: ['./depth-map-exchange-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthMapExchangeSettingsComponent implements OnInit, OnChanges {
  @Input()
  public tabActiveIndex: number = 0;

  @Input()
  public settings: DepthMapSettings;

  @Output()
  public changeSettings: EventEmitter<DepthMapSettings> =
    new EventEmitter<DepthMapSettings>();

  private subscription: Subscription = new Subscription();

  public exchanges: Exchange[] = getMainExchangesData().map((i) => i.exchange);

  public exchangeSettingsForm: FormGroup = new FormGroup({
    active: new FormControl<boolean>(false),
    smallOrderFilterValues: new FormGroup({
      minCorrosionTime: new FormControl<number>(0, Validators.required),
      minOrderSum: new FormControl<number>(0, Validators.required),
      filterByOrderSum: new FormControl<boolean>(false),
    }),
    mediumOrderFilterValues: new FormGroup({
      minCorrosionTime: new FormControl<number>(0, Validators.required),
      minOrderSum: new FormControl<number>(0, Validators.required),
      filterByOrderSum: new FormControl<boolean>(false),
    }),
    largeOrderFilterValues: new FormGroup({
      minCorrosionTime: new FormControl<number>(0, Validators.required),
      minOrderSum: new FormControl<number>(0, Validators.required),
      filterByOrderSum: new FormControl<boolean>(false),
    }),
    volumeFilterIsActive: new FormControl<boolean>(true, Validators.required),
    priceChangeFilterIsActive: new FormControl<boolean>(
      true,
      Validators.required,
    ),
    volumeFromFilter: new FormControl<number>(0, Validators.required),
    volumeToFilter: new FormControl<number>(0, Validators.required),
    priceChangeFromFilter: new FormControl<number>(0, Validators.required),
    priceChangeToFilter: new FormControl<number>(0, Validators.required),
    priceChangeFilterPeriod: new FormControl<DepthMapFilterPeriod>(
      '24h',
      Validators.required,
    ),
    volumeFilterPeriod: new FormControl<DepthMapFilterPeriod>(
      '24h',
      Validators.required,
    ),
  });

  public filterRangeOptions: { name: string; label: string }[] = [
    { name: '1m', label: 'За последнюю 1 минуту' },
    { name: '3m', label: 'За последние 3 минуты' },
    { name: '5m', label: 'За последние 5 минут' },
    { name: '15m', label: 'За последние 15 минут' },
    { name: '30m', label: 'За последние 30 минут' },
    { name: '1h', label: 'За последний час' },
    { name: '2h', label: 'За последние 2 часа' },
    { name: '6h', label: 'За последние 6 часов' },
    { name: '12h', label: 'За последние 12 часов' },
    { name: '24h', label: 'За последние 24 часа' },
  ];

  public ngOnInit() {
    this.prepatchValues();

    this.exchangeSettingsForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        this.changeSettings.emit({
          ...this.settings,
          exchangesSettings: {
            ...this.settings.exchangesSettings,
            [this.getCurrentExchange()]: value,
          },
        });
      });
  }

  public ngOnChanges({ tabActiveIndex }: SimpleChanges) {
    if (tabActiveIndex) {
      this.prepatchValues();
    }
  }

  private getCurrentExchange(): Exchange {
    return this.exchanges[this.tabActiveIndex];
  }

  private prepatchValues(): void {
    const currentExchangeSettings: DepthMapExchangeSettings =
      this.settings.exchangesSettings[this.getCurrentExchange()];

    this.exchangeSettingsForm.patchValue(
      {
        active: !!currentExchangeSettings.active ?? false,

        volumeFilterIsActive:
          !!currentExchangeSettings.volumeFilterIsActive ?? false,
        volumeFromFilter: currentExchangeSettings.volumeFromFilter ?? 0,
        volumeToFilter:
          currentExchangeSettings.volumeToFilter ?? 100_000_000_000,
        volumeFilterPeriod: currentExchangeSettings.volumeFilterPeriod ?? '24h',

        priceChangeFilterIsActive:
          !!currentExchangeSettings.priceChangeFilterIsActive ?? false,
        priceChangeFromFilter:
          currentExchangeSettings.priceChangeFromFilter ?? 0,
        priceChangeToFilter:
          currentExchangeSettings.priceChangeToFilter ?? 10_000,
        priceChangeFilterPeriod:
          currentExchangeSettings.priceChangeFilterPeriod ?? '24h',

        smallOrderFilterValues:
          currentExchangeSettings.smallOrderFilterValues ??
          defaultSmallDepthMapOrderFilterValues,
        mediumOrderFilterValues:
          currentExchangeSettings.mediumOrderFilterValues ??
          defaultMediumDepthMapOrderFilterValues,
        largeOrderFilterValues:
          currentExchangeSettings.largeOrderFilterValues ??
          defaultLargeDepthMapOrderFilterValues,
      },
      { emitEvent: false },
    );
  }

  protected readonly convertPrice = convertPrice;
}
