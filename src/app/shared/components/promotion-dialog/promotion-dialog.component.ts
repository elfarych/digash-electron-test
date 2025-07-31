import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { interval, map, Observable, Subscription } from 'rxjs';
import { UserData } from '../../models/Auth';
import { DateTime } from 'luxon';
import { TranslateModule } from '@ngx-translate/core';
import { PremiumNewYearComponent } from '../premium/components/premium-new-year/premium-new-year.component';
import { PremiumLoyaltyBlockComponent } from '../premium/components/premium-loyalty-block/premium-loyalty-block.component';

@Component({
  selector: 'app-promotion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TranslateModule,
    PremiumNewYearComponent,
    PremiumLoyaltyBlockComponent,
  ],
  templateUrl: './promotion-dialog.component.html',
  styleUrls: ['./promotion-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionDialogComponent implements OnInit, OnDestroy {
  public user$: Observable<UserData> = this.authService.getUserData();
  public visible = false;
  public countdown: string;
  private subscriptions: Subscription = new Subscription();
  private loyaltyDiscount;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.visible = false;
    this.subscriptions.add(
      this.user$.subscribe((user: UserData) => {
        if (user && user.loyalty_discount) {
          this.loyaltyDiscount = user.loyalty_discount;
          const promoShown = localStorage.getItem(
            'digash-special-discount-' + user.loyalty_discount.id,
          );
          const promoShownRepeat = localStorage.getItem(
            'digash-special-discount-repeat-' + user.loyalty_discount.id,
          );
          const expiresAt = new Date(
            user.loyalty_discount.expires_at,
          ).getTime();
          const now = Date.now();
          const fourHours = 4 * 60 * 60 * 1000;

          if (!promoShown) {
            this.visible = true;
            this.cdr.detectChanges();
          } else if (expiresAt - now < fourHours && !promoShownRepeat) {
            this.visible = true;
            this.cdr.detectChanges();
          }
        }
      }),
    );

    const endDate = DateTime.fromISO('2024-06-15T00:00:00+03:00');
    this.countdown = this.calculateTimeLeft(endDate);
    this.subscriptions.add(
      interval(1000)
        .pipe(map(() => this.calculateTimeLeft(endDate)))
        .subscribe((timeLeft) => {
          this.countdown = timeLeft;
          this.cdr.detectChanges();
        }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public redirectToPayment(): void {
    this.router.navigate(['app', 'premium']);
    this.close();
  }

  public close(): void {
    const promoShown = localStorage.getItem(
      'digash-special-discount-' + this.loyaltyDiscount?.id,
    );
    if (promoShown) {
      localStorage.setItem(
        'digash-special-discount-repeat-' + this.loyaltyDiscount?.id,
        'true',
      );
    }
    localStorage.setItem(
      'digash-special-discount-' + this.loyaltyDiscount?.id,
      'true',
    );
    this.visible = false;
    this.cdr.detectChanges();
  }

  private calculateTimeLeft(endDate: DateTime): string {
    const now = DateTime.now().setZone('UTC+3');
    const difference = endDate.diff(now).toMillis();

    if (difference <= 0) {
      return 'Предзаказы закончились';
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${days} дней, ${hours} часов, ${minutes} минут и ${seconds} секунд`;
  }
}
