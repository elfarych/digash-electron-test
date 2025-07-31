import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom, Observable } from 'rxjs';
import { selectUserData } from '../../../auth/data-access/auth.selectors';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { TooltipsComponent } from '../../../shared/components/tooltips/tooltips.component';
import { UserData } from '../../../shared/models/Auth';
import { ExchangeKeysSetupService } from './exchange-keys-setup.service';
import { ExchangeApiConnectResponse } from './utils/exchange-keys-setup.models';

@Component({
  selector: 'app-exchange-keys-setup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerComponent,
    TooltipsComponent,
    ToastModule,
    ConfirmPopupModule,
  ],
  templateUrl: './exchange-keys-setup.component.html',
  styleUrls: ['./exchange-keys-setup.component.scss'],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeKeysSetupComponent {
  public errorMessage$: Observable<string> = this.service.errorMessage$;
  public user$: Observable<UserData> = this.store.select(selectUserData);

  public connected: boolean = false;
  public loading: boolean = false;
  public changeBinanceKeysMode: boolean = false;

  public binanceForm: FormGroup = new FormGroup({
    api_key: new FormControl('', [Validators.required]),
    api_secret: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly service: ExchangeKeysSetupService,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly confirmationService: ConfirmationService,
    private readonly translateService: TranslateService,
  ) {}

  public async submit(): Promise<void> {
    this.loading = true;
    this.cdr.detectChanges();

    const result: ExchangeApiConnectResponse = await firstValueFrom(
      this.service.connectBinanceAccount(this.binanceForm.getRawValue()),
    );
    if (result.success) {
      this.connected = true;
      this.clearBinanceForm();
      this.changeBinanceKeysMode = false;
    }

    this.loading = false;
    this.cdr.detectChanges();
  }

  public changeBinanceApiKeys(): void {
    this.changeBinanceKeysMode = true;
  }

  public async disconnectBinanceAccount(): Promise<void> {
    this.loading = true;
    this.cdr.detectChanges();

    await firstValueFrom(this.service.disconnectBinanceAccount());

    location.reload();
  }

  private clearBinanceForm(): void {
    this.binanceForm.patchValue({
      api_key: '',
      api_secret: '',
    });
  }

  public confirmDisconnectBinanceAccount() {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant(
        'profile.exchangeSetup.disconnect_api_key',
      ),
      message: this.translateService.instant(
        'profile.exchangeSetup.disconnect_binance_api_key_question',
      ),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Отмена',
      accept: async () => {
        await this.disconnectBinanceAccount();
      },
    });
  }
}
