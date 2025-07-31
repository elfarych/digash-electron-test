import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PreferencesService } from '../preferences/data-access/preferences.service';
import { filter, firstValueFrom, Observable, Subscription, take } from 'rxjs';
import { Preferences } from '../../models/Preferences';
import { initialPreferencesState } from '../preferences/data-access/preferences.reducer';
import { DropdownModule } from 'primeng/dropdown';
import {
  ChartYScaleType,
  getChartYScaleTypes,
} from '../../models/ChartYScaleTypes';
import { ChartType, getChartTypes } from '../../models/ChartType';

type NavigationSection = 'instrument' | 'chart' | 'drawingTools';

@Component({
  selector: 'app-chart-theme-settings',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
  ],
  templateUrl: './chart-theme-settings.component.html',
  styleUrls: ['./chart-theme-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartThemeSettingsComponent implements OnInit, OnDestroy {
  public preferences$: Observable<Preferences> = this.service.preferences$;
  public preferencesLoaded$: Observable<boolean> =
    this.service.preferencesLoaded$;

  public showDialog: boolean = false;
  public section: NavigationSection = 'instrument';
  public sections: NavigationSection[] = [
    'instrument',
    'chart',
    'drawingTools',
  ];

  public form: FormGroup = new FormGroup({
    candleBuyColor: new FormControl<string>(''),
    candleSellColor: new FormControl<string>(''),

    candleShadowBuyColor: new FormControl<string>(''),
    candleShadowSellColor: new FormControl<string>(''),

    showVolume: new FormControl(true),
    volumeBuyColor: new FormControl<string>(''),
    volumeSellColor: new FormControl<string>(''),

    chartBackgroundColor: new FormControl<string>(''),
    chartBackgroundSecondColor: new FormControl<string>(''),

    chartGridColor: new FormControl<string>(''),
    chartCrosshairColor: new FormControl<string>(''),
    chartTextColor: new FormControl<string>(''),
    chartPanelColor: new FormControl<string>(''),
    chartYScale: new FormControl<ChartYScaleType>('Regular'),

    buyLimitOrderColor: new FormControl<string>(''),
    sellLimitOrderColor: new FormControl<string>(''),

    trendLevelSupportColor: new FormControl<string>(''),
    trendLevelResistanceColor: new FormControl<string>(''),

    horizontalLevelColor: new FormControl<string>(''),
    dailyHighLowColor: new FormControl<string>(''),
    rectangleColor: new FormControl<string>(''),
    brushColor: new FormControl<string>(''),
    showChartGrid: new FormControl<boolean>(true),

    chartType: new FormControl<ChartType>('candlestick'),
    doubleClickAlert: new FormControl(false),

    showLegend: new FormControl<boolean>(true),
  });

  private subscriptions: Subscription = new Subscription();

  public readonly ChartYScaleTypes = getChartYScaleTypes(this.translateService);
  public readonly ChartTypes = getChartTypes(this.translateService);

  constructor(
    private service: PreferencesService,
    private translateService: TranslateService,
  ) {}

  public openSettings(): void {
    this.showDialog = true;
  }

  public changeSection(section: NavigationSection): void {
    this.section = section;
  }

  public ngOnInit(): void {
    this.preferencesLoaded$
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.prepatchValues());
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async save(): Promise<void> {
    const preferences = await firstValueFrom(this.preferences$);

    if (this.form.valid) {
      this.service.updatePreferences({
        ...preferences,
        chartThemeSettings: {
          ...this.form.getRawValue(),
        },
      });
    }

    this.showDialog = false;
  }

  public cancel(): void {
    this.showDialog = false;
    this.prepatchValues();
  }

  public discard(): void {
    this.prepatchValues(true);
  }

  private async prepatchValues(discardSettings = false): Promise<void> {
    const preferences = discardSettings
      ? initialPreferencesState
      : await firstValueFrom(this.preferences$);
    this.form.patchValue({
      candleBuyColor:
        preferences.chartThemeSettings.candleBuyColor ??
        initialPreferencesState.chartThemeSettings.candleBuyColor,
      candleSellColor:
        preferences.chartThemeSettings.candleSellColor ??
        initialPreferencesState.chartThemeSettings.candleSellColor,
      candleShadowBuyColor:
        preferences.chartThemeSettings.candleShadowBuyColor ??
        initialPreferencesState.chartThemeSettings.candleShadowBuyColor,
      candleShadowSellColor:
        preferences.chartThemeSettings.candleShadowSellColor ??
        initialPreferencesState.chartThemeSettings.candleShadowSellColor,
      volumeBuyColor:
        preferences.chartThemeSettings.volumeBuyColor ??
        initialPreferencesState.chartThemeSettings.volumeBuyColor,
      volumeSellColor:
        preferences.chartThemeSettings.volumeSellColor ??
        initialPreferencesState.chartThemeSettings.volumeSellColor,
      chartBackgroundColor:
        preferences.chartThemeSettings.chartBackgroundColor ??
        initialPreferencesState.chartThemeSettings.chartBackgroundColor,
      chartBackgroundSecondColor:
        preferences.chartThemeSettings.chartBackgroundSecondColor ??
        initialPreferencesState.chartThemeSettings.chartBackgroundSecondColor,
      chartGridColor:
        preferences.chartThemeSettings.chartGridColor ??
        initialPreferencesState.chartThemeSettings.chartGridColor,
      showChartGrid:
        !!preferences.chartThemeSettings.showChartGrid ??
        !!initialPreferencesState.chartThemeSettings.showChartGrid,
      chartCrosshairColor:
        preferences.chartThemeSettings.chartCrosshairColor ??
        initialPreferencesState.chartThemeSettings.chartCrosshairColor,
      chartTextColor:
        preferences.chartThemeSettings.chartTextColor ??
        initialPreferencesState.chartThemeSettings.chartTextColor,
      chartPanelColor:
        preferences.chartThemeSettings.chartPanelColor ??
        initialPreferencesState.chartThemeSettings.chartPanelColor,
      buyLimitOrderColor:
        preferences.chartThemeSettings.buyLimitOrderColor ??
        initialPreferencesState.chartThemeSettings.buyLimitOrderColor,
      sellLimitOrderColor:
        preferences.chartThemeSettings.sellLimitOrderColor ??
        initialPreferencesState.chartThemeSettings.sellLimitOrderColor,
      trendLevelSupportColor:
        preferences.chartThemeSettings.trendLevelSupportColor ??
        initialPreferencesState.chartThemeSettings.trendLevelSupportColor,
      trendLevelResistanceColor:
        preferences.chartThemeSettings.trendLevelResistanceColor ??
        initialPreferencesState.chartThemeSettings.trendLevelResistanceColor,
      horizontalLevelColor:
        preferences.chartThemeSettings.horizontalLevelColor ??
        initialPreferencesState.chartThemeSettings.horizontalLevelColor,
      rectangleColor:
        preferences.chartThemeSettings.rectangleColor ??
        initialPreferencesState.chartThemeSettings.rectangleColor,
      brushColor:
        preferences.chartThemeSettings.brushColor ??
        initialPreferencesState.chartThemeSettings.brushColor,
      dailyHighLowColor:
        preferences.chartThemeSettings.dailyHighLowColor ??
        initialPreferencesState.chartThemeSettings.dailyHighLowColor,
      showVolume:
        preferences.chartThemeSettings.showVolume ??
        initialPreferencesState.chartThemeSettings.showVolume,
      chartYScale:
        preferences.chartThemeSettings.chartYScale ??
        initialPreferencesState.chartThemeSettings.chartYScale,
      chartType:
        preferences.chartThemeSettings.chartType ??
        initialPreferencesState.chartThemeSettings.chartType,
      doubleClickAlert:
        preferences.chartThemeSettings.doubleClickAlert ??
        initialPreferencesState.chartThemeSettings.doubleClickAlert,
      showLegend:
        preferences.chartThemeSettings.showLegend ??
        initialPreferencesState.chartThemeSettings.showLegend,
    });
  }
}
