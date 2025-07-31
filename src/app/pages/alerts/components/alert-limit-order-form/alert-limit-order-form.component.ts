import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
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
import { Subscription } from 'rxjs';
import { convertPrice } from '../../../../shared/utils/priceConverter';
import {
  baseAlertForm,
  LimitOrderAlert,
  patchAlertBaseValues,
} from '../../../../shared/models/Alert';
import { ExchangeSelectorComponent } from '../../../../shared/components/exchange-selector/exchange-selector.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AlertBaseFormComponent } from '../alert-base-form/alert-base-form.component';
import {TooltipModule} from "primeng/tooltip";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-limit-order-form',
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
    TooltipModule,
    TranslateModule
  ],
  templateUrl: './alert-limit-order-form.component.html',
  styleUrls: ['./alert-limit-order-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertLimitOrderFormComponent implements OnInit, OnDestroy {
  @Input()
  public alert: LimitOrderAlert;

  @Input()
  public edit = false;

  private readonly subscriptions: Subscription = new Subscription();

  public readonly form: FormGroup = new FormGroup({
    ...baseAlertForm().controls,

    size: new FormControl(400_000, [
      Validators.min(150_000),
      Validators.max(50_000_000),
      Validators.required,
    ]),
    corrosion_time: new FormControl(2, [
      Validators.min(0),
      Validators.max(10_000),
      Validators.required,
    ]),
    living_time: new FormControl(20, [
      Validators.min(0),
      Validators.max(10_000),
      Validators.required,
    ]),
    distance: new FormControl(2, [
      Validators.min(0.1),
      Validators.max(5),
      Validators.required,
    ]),
    round_density: new FormControl(false)
  });

  public readableMoneyForLimitOrder: string;
  public formTouched = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.form
        .get('size')
        .valueChanges.subscribe(
          (value: number) =>
            (this.readableMoneyForLimitOrder = convertPrice(value)),
        ),
    );

    if (this.alert) {
      this.patchValues();
    }
    this.readableMoneyForLimitOrder = convertPrice(this.form.get('size').value);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public exchangeChange(exchange: Exchange): void {
    this.form.get('market').setValue(exchange);
  }

  public submit(): any {
    this.formTouched = true;

    if (this.form.valid) {
      const corrosion_time = this.form.get('corrosion_time').value;
      const living_time = this.form.get('living_time').value;
      const distance = this.form.get('distance').value;
      this.form
        .get('values_comment')
        .setValue(
          `${this.translateService.instant('alerts.size')} ${this.readableMoneyForLimitOrder}, ` +
          `${this.translateService.instant('alerts.corrosionTime')} ${corrosion_time} (${this.translateService.instant('alerts.minutes')}), ` +
          `${this.translateService.instant('alerts.lifetimeFrom')} ${living_time} (${this.translateService.instant('alerts.minutes')}), ` +
          `${this.translateService.instant('alerts.distance')} ${distance}%`
        );

      return this.form.getRawValue();
    }

    this.cdr.detectChanges();
    return void 0;
  }

  private patchValues(): void {
    this.form.patchValue({
      ...patchAlertBaseValues(this.alert),
      round_density: this.alert.round_density,
      size: this.alert.size,
      corrosion_time: this.alert.corrosion_time,
      living_time: this.alert.living_time,
      distance: this.alert.distance,
    });
  }
}
