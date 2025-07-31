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
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DepthDataLoaderMode, DepthMapSettings } from '../../utils/models';
import { TabViewModule } from 'primeng/tabview';
import {
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
import { getDepthMapDefaultSettings } from '../../utils/defaultSettings';
import { DropdownOptions } from '../../../../shared/types/base.types';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { DepthMapExchangeSettingsComponent } from '../depth-map-exchange-settings/depth-map-exchange-settings.component';
import { BlacklistBuilderComponent } from '../../../../shared/components/blacklist-builder/blacklist-builder.component';
import { getTimeframes, Timeframe } from '../../../../shared/models/Timeframe';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { isMobileDevice } from '../../../../shared/utils/device';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-depth-map-settings',
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
    DepthMapExchangeSettingsComponent,
    BlacklistBuilderComponent,
    SelectButtonModule,
    ScrollPanelModule,
    CheckboxModule,
    DividerModule,
    TranslateModule
  ],
  templateUrl: './depth-map-settings.component.html',
  styleUrls: ['./depth-map-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthMapSettingsComponent implements OnInit, OnDestroy, OnChanges {
  protected readonly PrimeIcons = PrimeIcons;

  @Input()
  public settings: DepthMapSettings;

  @Input()
  public coins: { symbol: string }[] = [];

  @Output()
  public changeSettings: EventEmitter<DepthMapSettings> =
    new EventEmitter<DepthMapSettings>();

  public dialogVisible: boolean = false;
  public formTouched: boolean = false;
  public activeTabIndex: number = 0;
  public exchanges: ExchangeData[] = getMainExchangesData();
  public dataLoaderOptions: DropdownOptions<DepthDataLoaderMode> = [
    { label: 'Автоматически', value: 'auto' },
    { label: 'Вручную', value: 'manual' },
  ];

  public settingsForm: FormGroup = new FormGroup({
    askOrdersColor: new FormControl<string>(''),
    bidOrdersColor: new FormControl<string>(''),
    loaderMode: new FormControl<DepthDataLoaderMode>('auto'),
    chartTimeframe: new FormControl<Timeframe>('5m'),
    loaderIntervalSec: new FormControl<number>(10, [Validators.min(5)]),
    maxOrdersInColumn: new FormControl<number>(10, [Validators.min(5)]),

    showExchange: new FormControl<boolean>(true),
    showDistance: new FormControl<boolean>(false),
    showCorrosionTime: new FormControl<boolean>(false),
    showOrderSum: new FormControl<boolean>(false),
  });

  public timeframes = getTimeframes(this.translateService);

  private subscriptions: Subscription = new Subscription();

  constructor(private translateService: TranslateService) {}

  public ngOnInit() {
    this.prepatchSettingsFormValues();

    this.subscriptions.add(
      this.settingsForm
        .get('loaderIntervalSec')
        .valueChanges.subscribe((value) => {
          if (value < 5) this.settingsForm.get('loaderIntervalSec').setValue(5);
        }),
    );
  }

  public ngOnChanges({ settings }: SimpleChanges) {
    if (settings && !settings.isFirstChange()) {
      this.prepatchSettingsFormValues();
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public openSettings(): void {
    this.dialogVisible = true;
  }

  public save(): void {
    this.formTouched = true;

    if (!this.settingsForm.valid) {
      return void 0;
    }

    this.changeSettings.emit({
      ...this.settings,
      ...this.settingsForm.getRawValue(),
    });

    this.dialogVisible = false;
  }

  public close(): void {
    this.dialogVisible = false;
  }

  public resetSettings(): void {
    this.changeSettings.emit(getDepthMapDefaultSettings());
  }

  public selectBlacklistCoin(coin: string): void {
    const blacklist = JSON.parse(JSON.stringify(this.settings.blacklist || []));
    const index = blacklist.indexOf(coin);
    if (index === -1) {
      blacklist.push(coin);
    } else {
      blacklist.splice(index, 1);
    }
    this.changeSettings.emit({ ...this.settings, blacklist });
  }

  private prepatchSettingsFormValues(): void {
    const defaults: DepthMapSettings = getDepthMapDefaultSettings();
    this.settingsForm.patchValue(
      {
        askOrdersColor: this.settings.askOrdersColor ?? defaults.askOrdersColor,
        bidOrdersColor: this.settings.bidOrdersColor ?? defaults.bidOrdersColor,
        loaderMode: this.settings.loaderMode ?? defaults.loaderMode,
        chartTimeframe: this.settings.chartTimeframe ?? defaults.chartTimeframe,
        loaderIntervalSec:
          this.settings.loaderIntervalSec ?? defaults.loaderIntervalSec,
        maxOrdersInColumn:
          this.settings.maxOrdersInColumn ?? defaults.maxOrdersInColumn,

        showExchange: !!this.settings.showExchange ?? defaults.showExchange,
        showDistance: !!this.settings.showDistance ?? defaults.showDistance,
        showCorrosionTime:
          !!this.settings.showCorrosionTime ?? defaults.showCorrosionTime,
        showOrderSum: !!this.settings.showOrderSum ?? defaults.showOrderSum,
      },
      { emitEvent: false },
    );
  }

  protected readonly isMobileDevice = isMobileDevice;
}
