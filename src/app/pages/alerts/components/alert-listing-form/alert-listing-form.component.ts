import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Alert,
  baseAlertForm,
  ListingAlert,
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

@Component({
  selector: 'app-alert-listing-form',
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
  ],
  templateUrl: './alert-listing-form.component.html',
  styleUrls: ['./alert-listing-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertListingFormComponent implements OnInit {
  @Input()
  public alert: ListingAlert;

  @Input()
  public edit = false;

  public formTouched = false;

  public form: FormGroup = new FormGroup({
    ...baseAlertForm('listing').controls,
  });

  constructor(private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    if (this.alert) {
      this.patchValues();
    }
  }

  public submit(): Alert {
    this.formTouched = true;

    if (this.form.valid) {
      return this.form.getRawValue();
    }

    this.cdr.detectChanges();
    return void 0;
  }

  private patchValues(): void {
    this.form.patchValue({
      ...patchAlertBaseValues(this.alert),
    });
  }
}
