import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremiumNewYearComponent } from '../../shared/components/premium/components/premium-new-year/premium-new-year.component';
import { PremiumComponent } from '../../shared/components/premium/premium.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { AppGuardComponent } from '../../shared/components/app-guard/app-guard.component';
import { interval, map, Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { TranslateModule } from '@ngx-translate/core';
import { PricingSummerDiscountComponent } from './pricing-summer-discount/pricing-summer-discount.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    PremiumComponent,
    FooterComponent,
    MessagesModule,
    CardModule,
    AppGuardComponent,
    TranslateModule,
    PremiumNewYearComponent,
    PricingSummerDiscountComponent,
  ],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit, OnDestroy {
  public countdown: string;
  private subscription: Subscription;

  ngOnInit() {
    const endDate = DateTime.fromISO('2024-06-15T00:00:00+03:00');
    this.countdown = this.calculateTimeLeft(endDate);
    this.subscription = interval(1000)
      .pipe(map(() => this.calculateTimeLeft(endDate)))
      .subscribe((timeLeft) => (this.countdown = timeLeft));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
