import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  alertFormDefaultValues,
  AlertIntervalType,
  AlertPriceChangeTypeOptions,
  baseAlertForm,
  patchAlertBaseValues,
  VolumeSplashAlert,
  volumeSplashAlertIntervalOptions,
} from '../../../../shared/models/Alert';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertBaseFormComponent } from '../alert-base-form/alert-base-form.component';
import { AppIntervalSelectorComponent } from '../../../../shared/components/interval-selector/interval-selector.component';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'primeng/api';
import { getVolumeSplashTooltip } from '../../../../shared/utils/volumeSplashTooltip';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alerts-volume-splash-form',
  standalone: true,
  imports: [
    CommonModule,
    AlertBaseFormComponent,
    AppIntervalSelectorComponent,
    InputTextModule,
    PanelModule,
    ReactiveFormsModule,
    SharedModule,
    DropdownModule,
    CheckboxModule,
    InputNumberModule,
    TranslateModule,
  ],
  templateUrl: './alerts-volume-splash-form.component.html',
  styleUrls: ['./alerts-volume-splash-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsVolumeSplashFormComponent {
  @Input()
  public alert: VolumeSplashAlert;

  @Input()
  public edit = false;

  public formTouched = false;

  public readonly form: FormGroup = new FormGroup({
    ...baseAlertForm().controls,

    value: new FormControl(2, [
      Validators.min(2),
      Validators.max(100),
      Validators.required,
    ]),
    interval: new FormControl(alertFormDefaultValues.volumeSplashInterval, [
      Validators.required,
    ]),
    price_change: new FormControl(false),
    price_change_from: new FormControl(0, [
      Validators.min(0),
      Validators.max(100),
      Validators.required,
    ]),
    price_direction: new FormControl(
      alertFormDefaultValues.priceChangeDirection,
      [Validators.required],
    ),
  });

  constructor(
    public translateService: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    if (this.alert) {
      this.patchValues();
    }
  }

  public intervalChange(interval: AlertIntervalType): void {
    this.form.get('interval').setValue(interval);
  }

  public submit(): any {
    this.formTouched = true;

    if (this.form.valid) {
      const interval = this.form.get('interval').value?.split('_')[1];
      const value = this.form.get('value').value;
      this.form
        .get('values_comment')
        .setValue(
          `${this.translateService.instant('form.interval')} ${interval}, ${this.translateService.instant('form.splash')} x${value}`,
        );
      return this.form.getRawValue();
    }

    this.cdr.detectChanges();
    return void 0;
  }

  private patchValues(): void {
    this.form.patchValue({
      ...patchAlertBaseValues(this.alert),
      value: this.alert.value,
      interval: this.alert.interval,
      price_change_from: this.alert.price_change_from,
      price_change: this.alert.price_change,
      price_direction: this.alert.price_direction,
    });
    this.cdr.detectChanges();
  }

  protected readonly volumeSplashAlertIntervalOptions =
    volumeSplashAlertIntervalOptions(this.translateService);
  protected readonly getVolumeSplashTooltip = getVolumeSplashTooltip;
  protected readonly alertPriceChangeTypeOptions = AlertPriceChangeTypeOptions(
    this.translateService,
  );
}
