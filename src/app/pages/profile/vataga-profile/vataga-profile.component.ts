import {
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
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
import { VatagaRersources } from './vataga.resources';
import { VatagaTermsDialogComponent } from 'src/app/shared/components/vataga-terms-dialog/vataga-terms-dialog.component';

@Component({
  selector: 'app-vataga-profile',
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
  templateUrl: './vataga-profile.component.html',
  styleUrls: ['./vataga-profile.component.scss'],
})
export class VatagaProfileComponent {
  @Input()
  public user: UserData;

  public vatagaConnected: boolean = false;

  public vatagaBalance: string = '0';
  public loading: boolean = false;

  public ref: DynamicDialogRef | undefined;
  public vatagaId: string;

  public helpDialogVisible: boolean = false;

  constructor(
    private dialogService: DialogService,
    private rersources: VatagaRersources,
    private premiumResources: PremiumResources,
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    if (this.user.vataga_uuid) {
      this.trackvatagaBalance();
    }
  }

  public ngOnChanges({ user }: SimpleChanges): void {
    if (user) {
      this.vatagaConnected = !!this.user.vataga_uuid;
    }
  }

  public getProgressValue(): number {
    return (100 / 18) * parseFloat(this.vatagaBalance);
  }

  public activationDisabled(): boolean {
    return this.getProgressValue() < 100;
  }

  public openVataga(): void {
    this.ref = this.dialogService.open(VatagaTermsDialogComponent, {
      modal: true,
      draggable: true,
      resizable: true,
      dismissableMask: true,
      header: this.translateService.instant('vataga.terms_title'),
      width: '720px',
    });
  }

  public activatePremium(): void {
    this.loading = true;
    this.premiumResources
      .vatagaPremium()
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
        this.trackvatagaBalance();
      });
  }

  public connect(): void {
    if (!this.vatagaId) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('ERROR_CODES.ERROR'),
        detail: this.translateService.instant(
          'ERROR_CODES.VATAGA_UUID_NOT_PROVIDED',
        ),
      });
      return void 0;
    }
    this.loading = true;

    this.rersources
      .connect(this.vatagaId)
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
            'STATUS_MESSAGES.VATAGA_ACCOUNT_LINKED_SUCCESSFULLY',
          ),
        });
        this.vatagaConnected = true;
        this.loading = false;
        this.cdr.detectChanges();
        this.trackvatagaBalance();
      });
  }

  private trackvatagaBalance(): void {
    this.loading = true;
    this.rersources
      .balance()
      .pipe(take(1))
      .subscribe((balance) => {
        this.vatagaBalance = balance.toFixed(2);
        this.loading = false;
        this.cdr.detectChanges();
      });
  }
}
