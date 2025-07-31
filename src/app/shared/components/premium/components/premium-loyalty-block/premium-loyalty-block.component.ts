import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges, OnDestroy, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {PremiumLoyaltyDiscount} from "../../utils/models/PremiumLoyaltyDiscount";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {firstValueFrom, interval, Observable, Subscription} from "rxjs";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../../../auth/data-access/auth.service";
import {PremiumResources} from "../../premium.resources";
import {Router} from "@angular/router";
import {UserData} from "../../../../models/Auth";

const MONTH_PREMIUM_PRICE = 18
const MONTH_3_PREMIUM_PRICE = 54
const MONTH_6_PREMIUM_PRICE = 108
const MONTH_12_PREMIUM_PRICE = 216

@Component({
  selector: 'app-premium-loyalty-block',
  templateUrl: './premium-loyalty-block.component.html',
  styleUrls: ['./premium-loyalty-block.component.scss'],
  standalone: true,
  imports: [TranslateModule, ButtonModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PremiumLoyaltyBlockComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input()
  public discount: PremiumLoyaltyDiscount;

  @Input()
  public showClose: boolean = false;

  @ViewChild('premiumLoyaltyBlock')
  public premiumLoyaltyBlockRef: ElementRef<HTMLDivElement>;

  @Output()
  public closeDialog: EventEmitter<void> = new EventEmitter<void>();

  public priceNowYear: string;
  public priceNowMonth: string;
  public priceBeforeYear: string;
  public priceBeforeMonth: string;

  public countdownHours: string = '00';
  public countdownMinutes: string = '00';
  public countdownSeconds: string = '00';

  public premiumIsActive$ = this.authService.getPremiumIsActive();
  public userData$: Observable<UserData> = this.authService.getUserData();

  public processed = false;
  public errorMessage: string;

  private timerSub: Subscription;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private authService: AuthService,
    private resources: PremiumResources,
    private router: Router,
    private translateService: TranslateService
  ) { }

  public ngAfterViewInit(): void {
    // this.premiumLoyaltyBlockRef.nativeElement.classList.add(this.discount.discount_type);
    this.premiumLoyaltyBlockRef.nativeElement.classList.add("loyalty");
    this.startCountdownTimer();
  }

  public ngOnChanges({discount}: SimpleChanges): void {
    if (discount && discount.currentValue && this.discount.period === 'year') {
      this.priceNowYear = (MONTH_12_PREMIUM_PRICE - MONTH_12_PREMIUM_PRICE / 100 * this.discount.percent).toFixed(1);
      this.priceNowMonth = (MONTH_PREMIUM_PRICE - MONTH_PREMIUM_PRICE / 100 * this.discount.percent).toFixed(1);
      this.priceBeforeYear = MONTH_12_PREMIUM_PRICE.toString();
      this.priceBeforeMonth = MONTH_PREMIUM_PRICE.toString();
    }
  }

  public ngOnDestroy(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  public async payment(): Promise<void> {
    const premiumIsActive = await firstValueFrom(this.premiumIsActive$);
    const userData = await firstValueFrom(this.userData$);

    this.processed = true;
    this.errorMessage = undefined;
    let data: { url: string };
    this.cdr.detectChanges();

    if (!userData) {
      this.authService.openAuthPopup();
      return void 0;
    }

    try {
      if (userData.partner_promocode) {
        data = await this.resources.cryptomusPayment('12month', userData.partner_promocode);
      } else {
        data = await this.resources.cryptomusPayment('12month', undefined);

      }
    } catch (e) {
      this.processed = false;
      this.errorMessage = this.translateService.instant('premium.payment_error_message',);
      this.cdr.detectChanges();
      this.closeDialog.emit();
      return void 0;
    }

    if (data) {
      this.processed = false;
      this.cdr.detectChanges();
      window.open(data.url + '?lang=ru', '_self');
      this.closeDialog.emit();
    }
  }

  private startCountdownTimer(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }

    const calculate = () => {
      const now = new Date().getTime();
      const expires = new Date(this.discount.expires_at).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        this.countdownHours = '00';
        this.countdownMinutes = '00';
        this.countdownMinutes = '00';
        this.timerSub.unsubscribe();
        this.cdr.detectChanges();
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');

      this.countdownHours = hours;
      this.countdownMinutes = minutes;
      this.countdownSeconds = seconds;

      this.cdr.detectChanges();
    }

    calculate();
    this.timerSub = interval(1000).subscribe(() => calculate());
  }
}
