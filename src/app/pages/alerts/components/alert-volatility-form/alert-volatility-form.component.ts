import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Exchange } from '../../../../shared/models/Exchange';
import {
  alertFormDefaultValues,
  AlertIntervalType,
  baseAlertForm,
  patchAlertBaseValues,
  VolatilityAlert,
} from '../../../../shared/models/Alert';
import { ExchangeSelectorComponent } from '../../../../shared/components/exchange-selector/exchange-selector.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AlertBaseFormComponent } from '../alert-base-form/alert-base-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { AppIntervalSelectorComponent } from '../../../../shared/components/interval-selector/interval-selector.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-volatility-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExchangeSelectorComponent,
    CheckboxModule,
    InputTextModule,
    PanelModule,
    SharedModule,
    InputTextareaModule,
    AlertBaseFormComponent,
    DropdownModule,
    AppIntervalSelectorComponent,
    TranslateModule,
  ],
  templateUrl: './alert-volatility-form.component.html',
  styleUrls: ['./alert-volatility-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertVolatilityFormComponent implements OnInit {
  @Input()
  public alert: VolatilityAlert;

  @Input()
  public edit = false;

  public readonly form: FormGroup = new FormGroup(
    {
      ...baseAlertForm().controls,

      value: new FormControl('', [
        Validators.min(0.5),
        Validators.max(100),
        Validators.required,
      ]),
      interval: new FormControl(alertFormDefaultValues.interval, [
        Validators.required,
      ]),
    },
    { validators: this.checkValueByInterval() },
  );

  public formTouched = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    if (this.alert) {
      this.patchValues();
    }
  }

  public exchangeChange(exchange: Exchange): void {
    this.form.get('market').setValue(exchange);
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
          `${this.translateService.instant('form.interval')} ${interval}, ${this.translateService.instant('form.volatility')} ${value}`,
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
    });
  }

  private checkValueByInterval(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const value = group.get('value')?.value;
      const interval: AlertIntervalType = group.get('interval')?.value;

      switch (interval) {
        case 'interval_1m':
          if (value < 0.5)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 0.5%`,
            };
          break;
        case 'interval_3m':
          if (value < 0.5)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 0.5%`,
            };
          break;
        case 'interval_5m':
          if (value < 0.5)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 0.5%`,
            };
          break;
        case 'interval_15m':
          if (value < 0.5)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 0.5%`,
            };
          break;
        case 'interval_30m':
          if (value < 0.5)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 0.5%`,
            };
          break;
        case 'interval_1h':
          if (value < 0.5)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 0.5%`,
            };
          break;
        case 'interval_2h':
          if (value < 2)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 2%`,
            };
          break;
        case 'interval_6h':
          if (value < 2)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 2%`,
            };
          break;
        case 'interval_12h':
          if (value < 2)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 2%`,
            };
          break;
        case 'interval_24h':
          if (value < 2)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 2%`,
            };
          break;
        default:
          return null;
      }
      return null;
    };
  }
}
