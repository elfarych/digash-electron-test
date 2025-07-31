import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReferralCoupon } from '../../utils/models/referrals.model';
import { ToastModule } from 'primeng/toast';
import { noWhitespaceValidator } from '../../../../../shared/utils/form-validators';
import { Action } from '@ngrx/store';
import { Subscription, tap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-referrals-promo-codes',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DatePipe,
    DropdownModule,
    FormsModule,
    PanelModule,
    DividerModule,
    TagModule,
    NgForOf,
    ClipboardModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    ToastModule,
    ConfirmPopupModule,
    TranslateModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './referrals-promo-codes.component.html',
  styleUrls: ['./referrals-promo-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralsPromoCodesComponent
  implements OnChanges, OnInit, OnDestroy
{
  @Input()
  public coupons: ReferralCoupon[] = [];

  @Input()
  public closeUpdateDialog: Action;

  @Output()
  public createCoupon: EventEmitter<ReferralCoupon> =
    new EventEmitter<ReferralCoupon>();

  @Output()
  public updateCoupon: EventEmitter<ReferralCoupon> =
    new EventEmitter<ReferralCoupon>();

  @Output()
  public removeCoupon: EventEmitter<number> = new EventEmitter<number>();

  public dialogVisible: boolean = false;
  public formTouched: boolean = false;
  public editCouponId: number | null = null;
  public form: FormGroup = new FormGroup(
    {
      code: new FormControl('', [
        noWhitespaceValidator(),
        Validators.required,
        Validators.maxLength(50),
      ]),
      revenue: new FormControl(0, [
        Validators.min(0),
        Validators.max(30),
        Validators.required,
      ]),
      discount: new FormControl(0, [
        Validators.min(0),
        Validators.max(20),
        Validators.required,
      ]),
    },
    { validators: this.checkCouponSum() },
  );
  public userRefLink: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private clipboard: Clipboard,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
  ) {}

  public ngOnChanges({ closeUpdateDialog }: SimpleChanges): void {
    if (closeUpdateDialog && closeUpdateDialog.currentValue) {
      this.dialogVisible = false;
    }
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.form.valueChanges
        .pipe(tap(({ code }) => this.initRefLink(code)))
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public copyRefLink(code?: string): void {
    if (code) {
      this.initRefLink(code);
    }

    this.clipboard.copy(this.userRefLink);
    this.messageService.add({
      severity: 'success',
      summary: this.userRefLink,
      detail: this.translateService.instant('profile.refLinkCopied'),
    });
  }

  public copyToClipBoard(text: string): void {
    this.clipboard.copy(text);
    this.messageService.add({
      severity: 'success',
      summary: text,
      detail: this.translateService.instant('profile.promoCodeCopied'),
    });
  }

  public submit(): void {
    this.formTouched = true;

    if (this.form.valid) {
      if (this.editCouponId) {
        this.updateCoupon.emit({ ...this.form.value, id: this.editCouponId });
      } else {
        this.createCoupon.emit({ ...this.form.value });
      }
    }
  }

  public openCouponForm(coupon: ReferralCoupon | null): void {
    this.editCouponId = coupon?.id || null;
    this.patchFormValues(coupon);
    this.dialogVisible = true;
  }

  public deleteCoupon(coupon: ReferralCoupon): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('profile.deletePromoCode'),
      message: `${this.translateService.instant('profile.deletePromoCodeQuestion')} ${coupon.code}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translateService.instant('profile.yes'),
      rejectLabel: this.translateService.instant('profile.cancel'),
      accept: () => this.removeCoupon.emit(coupon.id),
    });
  }

  private patchFormValues(coupon: ReferralCoupon | null): void {
    this.form.patchValue({
      code: coupon?.code ?? '',
      revenue: coupon?.revenue ?? 0,
      discount: coupon?.discount.value ?? 0,
    });
  }

  private checkCouponSum(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const revenue = group.get('revenue')?.value;
      const discount = group.get('discount')?.value;

      if ((revenue ?? 0) + (discount ?? 0) !== 30) {
        return {
          validationErrorMessage:
            'Вознаграждение и скидка суммарно должны быть равны 30%. Скидка не должна превышать 20%',
        };
      }
      return null;
    };
  }

  private initRefLink(code: string): void {
    this.userRefLink = location.origin + '/#/?partner=' + code;
  }

  protected readonly PrimeIcons = PrimeIcons;
}
