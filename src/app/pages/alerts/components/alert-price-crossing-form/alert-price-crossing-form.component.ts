import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  Alert,
  baseAlertForm,
  patchAlertBaseValues,
  PriceAlert,
} from '../../../../shared/models/Alert';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ExchangeSelectorComponent } from '../../../../shared/components/exchange-selector/exchange-selector.component';
import { NgIf } from '@angular/common';
import { ChipsModule } from 'primeng/chips';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { AlertBaseFormComponent } from '../alert-base-form/alert-base-form.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-price-crossing-form',
  standalone: true,
  templateUrl: './alert-price-crossing-form.component.html',
  styleUrls: ['./alert-price-crossing-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    ExchangeSelectorComponent,
    NgIf,
    ChipsModule,
    InputTextModule,
    PanelModule,
    CheckboxModule,
    AlertBaseFormComponent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertPriceCrossingFormComponent implements OnInit {
  @Input()
  public alert: PriceAlert;

  @Input()
  public edit = false;

  public readonly form: FormGroup = new FormGroup({
    ...baseAlertForm().controls,

    symbol: new FormControl('', [Validators.required]),
    price_crossing: new FormControl(null, [
      Validators.required,
      Validators.min(0),
    ]),
  });

  public formTouched = false;

  public constructor(
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    if (this.alert) {
      this.patchValues();
    }
  }

  public submit(): Alert {
    this.formTouched = true;

    if (this.form.valid) {
      const symbol = this.form.get('symbol').value;
      const priceCrossing = this.form.get('price_crossing').value;
      this.form
        .get('values_comment')
        .setValue(
          `${this.translateService.instant('form.coin')} ${symbol}, ${this.translateService.instant('form.price_crossing')} ${priceCrossing}`,
        );
      return this.form.getRawValue();
    }

    this.cdr.detectChanges();
    return void 0;
  }

  private patchValues(): void {
    this.form.patchValue({
      ...patchAlertBaseValues(this.alert),
      price_crossing: this.alert.price_crossing,
      symbol: this.alert.symbol,
    });
  }
}
