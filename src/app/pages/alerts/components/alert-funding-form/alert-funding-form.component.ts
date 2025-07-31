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
import { Exchange, getExchangesData } from '../../../../shared/models/Exchange';
import {
  alertFormDefaultValues,
  AlertFundingDirectionType,
  AlertFundingTypeOptions,
  baseAlertForm,
  FundingAlert,
  patchAlertBaseValues,
} from '../../../../shared/models/Alert';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AlertBaseFormComponent } from '../alert-base-form/alert-base-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { AppIntervalSelectorComponent } from '../../../../shared/components/interval-selector/interval-selector.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownOptions } from '../../../../shared/types/base.types';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-alert-funding-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    InputTextModule,
    PanelModule,
    SharedModule,
    InputTextareaModule,
    AlertBaseFormComponent,
    DropdownModule,
    AppIntervalSelectorComponent,
    TranslateModule,
    InputNumberModule,
  ],
  templateUrl: './alert-funding-form.component.html',
  styleUrls: ['./alert-funding-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertFundingFormComponent implements OnInit {
  @Input()
  public alert: FundingAlert;

  @Input()
  public edit = false;

  public includedExchanges: Exchange[] = [];

  public readonly alertFundingTypeOptions = AlertFundingTypeOptions(
    this.translateService,
  );

  public readonly form: FormGroup = new FormGroup({
    ...baseAlertForm().controls,

    value: new FormControl(0.5, [
      Validators.min(0.5),
      Validators.max(100),
      Validators.required,
    ]),
    until_next_funding_minutes: new FormControl(120),
    direction: new FormControl(alertFormDefaultValues.fundingDirection, [
      Validators.required,
    ]),
  });

  public untilNextFundingTimeMinutesOptions: DropdownOptions<number> = [];
  public formTouched = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    if (this.alert) {
      this.patchValues();
    }

    this.includedExchanges = this.getIncludedExchanges();

    this.untilNextFundingTimeMinutesOptions = [
      {
        label: this.translateService.instant(
          'alerts.funding_parameters.option2Hour',
        ),
        value: 120,
      },
      {
        label: this.translateService.instant(
          'alerts.funding_parameters.option1Hour',
        ),
        value: 60,
      },
      {
        label: this.translateService.instant(
          'alerts.funding_parameters.option30Minutes',
        ),
        value: 30,
      },
      {
        label: this.translateService.instant(
          'alerts.funding_parameters.option15Minutes',
        ),
        value: 15,
      },
      {
        label: this.translateService.instant(
          'alerts.funding_parameters.option5Minutes',
        ),
        value: 5,
      },
    ];
  }

  public exchangeChange(exchange: Exchange): void {
    this.form.get('market').setValue(exchange);
  }

  public directionChange(direction: AlertFundingDirectionType): void {
    this.form.get('direction').setValue(direction);
  }

  public submit(): any {
    this.formTouched = true;
    if (this.form.valid) {
      const value = this.form.get('value').value;
      const direction = this.form.get('direction').value;
      this.form
        .get('values_comment')
        .setValue(
          `${this.translateService.instant('form.value_from')} ${value}%, ${this.getDirectionName(direction)}`,
        );
      return this.form.getRawValue();
    }

    this.cdr.detectChanges();
    return void 0;
  }

  public getIncludedExchanges(): Exchange[] {
    return getExchangesData()
      .filter((e) => e.market === 'F')
      .map((e) => e.exchange);
  }

  private patchValues(): void {
    this.form.patchValue({
      ...patchAlertBaseValues(this.alert),
      value: this.alert.value,
      direction: this.alert.direction,
      until_next_funding_minutes: this.alert.until_next_funding_minutes,
    });
  }

  private getDirectionName(direction: AlertFundingDirectionType): string {
    if (direction === 'positive')
      return this.translateService.instant('fundingDirection.positive');
    if (direction === 'negative')
      return this.translateService.instant('fundingDirection.negative');
    return this.translateService.instant('fundingDirection.all');
  }
}
