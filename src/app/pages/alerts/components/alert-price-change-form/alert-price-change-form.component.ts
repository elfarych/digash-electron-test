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
  AlertPriceChangeDirectionType,
  AlertPriceChangeTypeOptions,
  baseAlertForm,
  patchAlertBaseValues,
  PriceChangeAlert,
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
  selector: 'app-alert-price-change-form',
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
  templateUrl: './alert-price-change-form.component.html',
  styleUrls: ['./alert-price-change-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertPriceChangeFormComponent implements OnInit {
  @Input()
  public alert: PriceChangeAlert;

  @Input()
  public edit = false;

  public readonly alertPriceChangeTypeOptions = AlertPriceChangeTypeOptions(
    this.translateService,
  );

  public readonly form: FormGroup = new FormGroup(
    {
      ...baseAlertForm().controls,

      value: new FormControl('', [
        Validators.min(1),
        Validators.max(100),
        Validators.required,
      ]),
      interval: new FormControl(alertFormDefaultValues.interval, [
        Validators.required,
      ]),
      direction: new FormControl(alertFormDefaultValues.priceChangeDirection, [
        Validators.required,
      ]),
    },
    { validators: this.checkChangeValueByInterval() },
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
      const direction = this.form.get('direction').value;
      this.form
        .get('values_comment')
        .setValue(
          `${this.translateService.instant('form.interval')} ${interval}, ${this.translateService.instant('form.value_from')} ${value}%, ${this.getDirectionName(direction)}`,
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
      direction: this.alert.direction,
    });
  }

  private checkChangeValueByInterval(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const changeValue = group.get('value')?.value;
      const interval: AlertIntervalType = group.get('interval')?.value;

      switch (interval) {
        case 'interval_1m':
          if (changeValue < 1)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 1%`,
            };
          break;
        case 'interval_3m':
          if (changeValue < 1)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 1%`,
            };
          break;
        case 'interval_5m':
          if (changeValue < 1)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 1%`,
            };
          break;
        case 'interval_15m':
          if (changeValue < 2.5)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 2.5%`,
            };
          break;
        case 'interval_30m':
          if (changeValue < 5)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 5%`,
            };
          break;
        case 'interval_1h':
          if (changeValue < 5)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 5%`,
            };
          break;
        case 'interval_2h':
          if (changeValue < 7)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 7%`,
            };
          break;
        case 'interval_6h':
          if (changeValue < 10)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 10%`,
            };
          break;
        case 'interval_12h':
          if (changeValue < 10)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 10%`,
            };
          break;
        case 'interval_24h':
          if (changeValue < 10)
            return {
              validationErrorMessage: `${this.translateService.instant('form.min_value')} 10%`,
            };
          break;
        default:
          return null;
      }
      return null;
    };
  }

  private getDirectionName(direction: AlertPriceChangeDirectionType): string {
    if (direction === 'up')
      return this.translateService.instant('alerts.directionUp');
    if (direction === 'down')
      return this.translateService.instant('alerts.directionDown');
    return this.translateService.instant('alerts.allDirections');
  }
}
