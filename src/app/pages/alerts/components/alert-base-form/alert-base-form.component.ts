import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Exchange } from '../../../../shared/models/Exchange';
import { ExchangeSelectorComponent } from '../../../../shared/components/exchange-selector/exchange-selector.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AlertsSoundSelectorComponent } from '../alerts-sound-selector/alerts-sound-selector.component';
import {
  AlertIntervalType,
  AlertSoundType,
} from '../../../../shared/models/Alert';
import { DividerModule } from 'primeng/divider';
import { AppIntervalSelectorComponent } from '../../../../shared/components/interval-selector/interval-selector.component';
import { convertPrice } from '../../../../shared/utils/priceConverter';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-base-form',
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
    AlertsSoundSelectorComponent,
    DividerModule,
    AppIntervalSelectorComponent,
    TranslateModule,
  ],
  templateUrl: './alert-base-form.component.html',
  styleUrls: ['./alert-base-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBaseFormComponent implements OnInit, OnDestroy {
  @Input()
  public edit = false;

  @Input()
  public isListingAlert = false;

  @Input()
  public form: FormGroup;

  @Input()
  public formTouched = false;

  @Input()
  public isPriceGrossingAlert = false;

  @Input()
  public includedExchanges: Exchange[] = [];

  public readableVolumeFrom: string;
  public readableVolumeTo: string;

  private subscriptions: Subscription = new Subscription();

  public ngOnInit(): void {
    if (!this.isListingAlert) {
      this.subscriptions.add(
        this.form
          .get('volume_filter_from')
          .valueChanges.subscribe(
            (value: number) => (this.readableVolumeFrom = convertPrice(value)),
          ),
      );

      this.subscriptions.add(
        this.form
          .get('volume_filter_to')
          .valueChanges.subscribe(
            (value: number) => (this.readableVolumeTo = convertPrice(value)),
          ),
      );

      this.readableVolumeFrom = convertPrice(
        this.form.get('volume_filter_from').value,
      );
      this.readableVolumeTo = convertPrice(
        this.form.get('volume_filter_to').value,
      );
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public exchangeChange(exchange: Exchange): void {
    this.form.get('market').setValue(exchange);
  }

  public changeSound(sound: AlertSoundType) {
    this.form.get('alert_sound_name').setValue(sound);
  }

  public intervalChange(interval: AlertIntervalType): void {
    this.form.get('volume_filter_interval').setValue(interval);
  }
}
