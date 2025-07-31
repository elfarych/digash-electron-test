import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { Alert, AlertType } from '../../../../shared/models/Alert';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';
import { AlertsService } from '../../../../shared/store/alerts/alerts.service';
import { AlertLimitOrderFormComponent } from '../alert-limit-order-form/alert-limit-order-form.component';
import { AlertPriceCrossingFormComponent } from '../alert-price-crossing-form/alert-price-crossing-form.component';
import { AlertTypeSelectionComponent } from '../alert-type-selection/alert-type-selection.component';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { AlertPriceChangeFormComponent } from '../alert-price-change-form/alert-price-change-form.component';
import { AlertBtcCorrelationFormComponent } from '../alert-btc-correlation-form/alert-btc-correlation-form.component';
import { AlertVolatilityFormComponent } from '../alert-volatility-form/alert-volatility-form.component';
import { AlertListingFormComponent } from '../alert-listing-form/alert-listing-form.component';
import { AlertsVolumeSplashFormComponent } from '../alerts-volume-splash-form/alerts-volume-splash-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { AlertFundingFormComponent } from '../alert-funding-form/alert-funding-form.component';

@Component({
  selector: 'app-create-alert-modal',
  standalone: true,
  imports: [
    CommonModule,
    AlertTypeSelectionComponent,
    AlertPriceCrossingFormComponent,
    AlertLimitOrderFormComponent,
    DialogModule,
    PanelModule,
    ButtonModule,
    AlertPriceChangeFormComponent,
    AlertBtcCorrelationFormComponent,
    AlertVolatilityFormComponent,
    AlertListingFormComponent,
    AlertsVolumeSplashFormComponent,
    TranslateModule,
    ErrorMessageComponent,
    AlertFundingFormComponent,
  ],
  templateUrl: './create-alert-modal.component.html',
  styleUrls: ['./create-alert-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAlertModalComponent implements OnInit {
  @ViewChild(AlertLimitOrderFormComponent)
  public limitOrderForm: AlertLimitOrderFormComponent;

  @ViewChild(AlertPriceCrossingFormComponent)
  public priceCrossingForm: AlertPriceCrossingFormComponent;

  @ViewChild(AlertPriceChangeFormComponent)
  public priceChangeForm: AlertPriceChangeFormComponent;

  @ViewChild(AlertBtcCorrelationFormComponent)
  public correlationBTCForm: AlertBtcCorrelationFormComponent;

  @ViewChild(AlertVolatilityFormComponent)
  public volatilityForm: AlertVolatilityFormComponent;

  @ViewChild(AlertListingFormComponent)
  public listingForm: AlertListingFormComponent;

  @ViewChild(AlertsVolumeSplashFormComponent)
  public volumeSplashForm: AlertsVolumeSplashFormComponent;

  @ViewChild(AlertFundingFormComponent)
  public fundingForm: AlertFundingFormComponent;

  public readonly errorMessage$: Observable<string> =
    this.alertsService.getErrorMessage();

  public showDialog = true;
  public selectedAlertType: AlertType;

  public constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    public data: { edit: boolean; alert: Alert; alertType: AlertType },
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.selectedAlertType =
      this.data.alert?.type || this.data.alertType || 'limitOrder';
  }
  public async submit(): Promise<void> {
    let data: Alert;

    switch (this.selectedAlertType) {
      case 'limitOrder':
        data = this.limitOrderForm.submit();
        break;
      case 'priceChange':
        data = this.priceChangeForm.submit();
        break;
      case 'price':
        data = this.priceCrossingForm.submit();
        break;
      case 'btcCorrelation':
        data = this.correlationBTCForm.submit();
        break;
      case 'volatility':
        data = this.volatilityForm.submit();
        break;
      case 'listing':
        data = this.listingForm.submit();
        break;
      case 'volumeSplash':
        data = this.volumeSplashForm.submit();
        break;
      case 'funding':
        data = this.fundingForm.submit();
        break;
    }

    if (data) {
      data = {
        ...data,
        type: this.selectedAlertType,
      };

      if (!this.data.edit) {
        this.alertsService.createAlert(data);
      } else {
        this.alertsService.editAlert(data, this.data.alert.id);
      }
    }
  }

  public getDialogHeader() {
    if (this.data.alert) {
      return `${this.data.alert.title}`;
    } else {
      return 'Новое оповещение';
    }
  }

  public alertTypeChange([alertType]): void {
    this.selectedAlertType = alertType;
  }

  protected readonly Array = Array;
  protected readonly Object = Object;
}
