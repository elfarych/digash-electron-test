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
} from '@angular/forms';
import { Exchange } from '../../../../shared/models/Exchange';
import {
  alertFormDefaultValues,
  AlertIntervalType,
  baseAlertForm,
  BTCCorrelationAlert,
  patchAlertBaseValues,
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
  selector: 'app-alert-btc-correlation-form',
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
  templateUrl: './alert-btc-correlation-form.component.html',
  styleUrls: ['./alert-btc-correlation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBtcCorrelationFormComponent implements OnInit {
  @Input()
  public alert: BTCCorrelationAlert;

  @Input()
  public edit = false;

  public formTouched = false;

  public form: FormGroup = new FormGroup({
    ...baseAlertForm().controls,
    value: new FormControl('', [
      Validators.min(-100),
      Validators.max(20),
      Validators.required,
    ]),
    interval: new FormControl(alertFormDefaultValues.interval, [
      Validators.required,
    ]),
  });

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
          `${this.translateService.instant('form.interval')} ${interval}, ${this.translateService.instant('form.correlation')} ${value}%`,
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
}
