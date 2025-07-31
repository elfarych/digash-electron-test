import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BitgetTermsDialogComponent } from 'src/app/shared/components/bitget-terms-dialog/bitget-terms-dialog.component';
import { InputTextModule } from 'primeng/inputtext';
import { BitgetRersources } from './bitget.resources';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { catchError, EMPTY, take } from 'rxjs';
import { ProgressSpinnerComponent } from 'src/app/shared/components/progress-spinner/progress-spinner.component';
import { UserData } from 'src/app/shared/models/Auth';
import { PremiumResources } from 'src/app/shared/components/premium/premium.resources';
import { AuthService } from 'src/app/auth/data-access/auth.service';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bitget-profile',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule,
    SvgIconComponent,
    ButtonModule,
    InputTextModule,
    ToastModule,
    FormsModule,
    ProgressSpinnerComponent,
    TooltipModule,
    DialogModule,
    ProgressBarModule,
    TranslateModule,
  ],
  templateUrl: './bitget-profile.component.html',
  styleUrls: ['./bitget-profile.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitgetProfileComponent implements OnInit, OnChanges {
  @Input()
  public user: UserData;

  public bitgetConnected: boolean = false;

  public bitgetBalance: string = '0';
  public loading: boolean = false;

  public ref: DynamicDialogRef | undefined;
  public bitgetId: string;

  public helpDialogVisible: boolean = false;

  constructor(
    private dialogService: DialogService,
    private rersources: BitgetRersources,
    private premiumResources: PremiumResources,
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    if (this.user.bitget_uuid) {
      this.trackBitgetBalance();
    }
  }

  public ngOnChanges({ user }: SimpleChanges): void {
    if (user) {
      this.bitgetConnected = !!this.user.bitget_uuid;
    }
  }

  public getProgressValue(): number {
    return (100 / 18) * parseFloat(this.bitgetBalance);
  }

  public activationDisabled(): boolean {
    return this.getProgressValue() < 100;
  }

  public openBitget(): void {
    this.ref = this.dialogService.open(BitgetTermsDialogComponent, {
      modal: true,
      draggable: true,
      resizable: true,
      dismissableMask: true,
      header: this.translateService.instant('bitget.bitget_terms_title'),
      width: '720px',
    });
  }

  public activatePremium(): void {
    this.loading = true;
    this.premiumResources
      .bitgetPremium()
      .pipe(
        take(1),
        catchError((error) => {
          // this.messageService.add({
          //   severity: 'error',
          //   summary: this.translateService.instant('ERROR_CODES.ERROR'),
          //   detail:
          //     error.error?.message ??
          //     this.translateService.instant('ERROR_CODES.IMPORT_FAILED'),
          // });
          console.error(error);
          this.loading = false;
          this.cdr.detectChanges();
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.authService.dispatchLoadUserData();

        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('STATUS_MESSAGES.SUCCESS'),
          detail: this.translateService.instant(
            'STATUS_MESSAGES.PREMIUM_ACTIVATED_SUCCESSFULLY',
          ),
        });
        this.loading = false;
        this.cdr.detectChanges();
        this.trackBitgetBalance();
      });
  }

  public connect(): void {
    if (!this.bitgetId) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('ERROR_CODES.ERROR'),
        detail: this.translateService.instant(
          'ERROR_CODES.BITGET_UUID_NOT_PROVIDED',
        ),
      });
      return void 0;
    }
    this.loading = true;

    this.rersources
      .connect(this.bitgetId)
      .pipe(
        take(1),
        catchError((error) => {
          // this.messageService.add({
          //   severity: 'error',
          //   summary: this.translateService.instant('ERROR_CODES.ERROR'),
          //   detail:
          //     error.error?.message ??
          //     this.translateService.instant('ERROR_CODES.ACTIVATION_ERROR'),
          // });
          console.error(error);
          this.loading = false;
          this.cdr.detectChanges();
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('STATUS_MESSAGES.SUCCESS'),
          detail: this.translateService.instant(
            'STATUS_MESSAGES.BITGET_ACCOUNT_LINKED_SUCCESSFULLY',
          ),
        });
        this.bitgetConnected = true;
        this.loading = false;
        this.cdr.detectChanges();
        this.trackBitgetBalance();
      });
  }

  private trackBitgetBalance(): void {
    this.loading = true;
    this.rersources
      .balance()
      .pipe(take(1))
      .subscribe(({ balance }) => {
        this.bitgetBalance = balance.toFixed(2);
        this.loading = false;
        this.cdr.detectChanges();
      });
  }
}
