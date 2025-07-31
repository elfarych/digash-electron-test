import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, interval, Observable, Subscription } from 'rxjs';
import moment from 'moment-timezone';
import { UserData } from '../../../shared/models/Auth';
import { AuthService } from '../../../auth/data-access/auth.service';
import { PremiumResources } from '../../../shared/components/premium/premium.resources';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pricing-summer-discount',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pricing-summer-discount.component.html',
  styleUrls: ['./pricing-summer-discount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingSummerDiscountComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input()
  public dialog: boolean = false;

  @Output()
  public closeDialog: EventEmitter<void> = new EventEmitter<void>();

  public remainingTime = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  };
  public processed = false;
  public errorMessage: string;

  private userData$: Observable<UserData> = this.authService.getUserData();

  private timerSubscription!: Subscription;
  private cometTimeout: number | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly resources: PremiumResources,
    private readonly messageService: MessageService,
    public readonly translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    this.startTimer();
  }

  public ngAfterViewInit() {
    this.createComet();
  }

  public ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    if (this.cometTimeout) {
      clearTimeout(this.cometTimeout);
    }
  }

  public scrollToPremium(): void {
    const element = document.getElementById('premium-block');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  public async payment(): Promise<void> {
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
        data = await this.resources.cryptomusPayment(
          '12month',
          userData.partner_promocode,
        );
      } else {
        data = await this.resources.cryptomusPayment('12month', undefined);
      }
    } catch (e) {
      this.processed = false;

      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('ERROR_CODES.ERROR'),
        detail: this.translateService.instant('premium.payment_error_message'),
      });

      this.cdr.detectChanges();
      this.closeDialog.emit();
      return void 0;
    }

    if (data) {
      this.processed = false;
      this.cdr.detectChanges();
      this.closeDialog.emit();
      window.open(data.url + '?lang=ru', '_self');
    }
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.remainingTime = this.calculateTime('2025-06-08', 'Europe/Moscow');
      this.cdr.detectChanges();
    });
  }

  private calculateTime(dateString, timeZone) {
    const now = moment.tz(timeZone);
    const targetDate = moment.tz(`${dateString}T00:00:00`, timeZone);

    const diff = targetDate.diff(now);
    if (diff <= 0) {
      this.remainingTime = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      };
    }

    const duration = moment.duration(diff);
    const days = Math.floor(duration.asDays()).toString().padStart(2, '0');
    const hours = duration.hours().toString().padStart(2, '0');
    const minutes = duration.minutes().toString().padStart(2, '0');
    const seconds = duration.seconds().toString().padStart(2, '0');

    return { days, hours, minutes, seconds };
  }

  private coinsAnimate(): void {
    const balls = document.querySelectorAll('.coin');

    balls.forEach((ball: HTMLElement) => {
      let posX = Math.random() * 100;
      let posY = Math.random() * 100;

      let directionX = Math.random() < 0.5 ? -0.3 : 0.3;
      const directionY = Math.random() < 0.5 ? -0.3 : 0.3;

      const speedX = 0.1 + Math.random() * 0.4;
      const speedY = 0.1 + Math.random() * 0.4;

      let angle = 0;
      const rotationSpeed = 0.5 + Math.random() * 2.0;

      function animate() {
        posX += directionX * speedX;
        posY += directionY * speedY;
        angle = (angle + rotationSpeed / 10) % 360;

        const maxPos = 100;

        if (posX > maxPos || posX < 0) {
          directionX *= -1;
          posX = Math.max(0, Math.min(maxPos, posX));
        }

        ball.style.transform = `translate(${posX}%, ${posY}%) rotate(${angle}deg)`;

        requestAnimationFrame(animate);
      }

      animate();
    });
  }

  private createComet(): void {
    const container = document.getElementById('discount-container');
    if (!container) {
      setTimeout(() => this.createComet(), 100);
      return;
    }

    const comet = document.createElement('div');
    comet.className = 'comet';

    const leftToRight = Math.random() > 0.5;

    const startX = leftToRight
      ? window.innerWidth * (0.1 + Math.random() * 0.3)
      : window.innerWidth * (0.6 + Math.random() * 0.3);

    const startY = 0;
    comet.style.left = `${startX}px`;
    comet.style.top = `${startY}px`;

    const speed = 0.8 + Math.random() * 0.7;
    comet.style.animation = `fall-${leftToRight ? 'ltr' : 'rtl'} ${speed}s linear forwards`;

    container.appendChild(comet);
    setTimeout(() => comet.remove(), speed * 1000 + 200);
    this.cometTimeout = setTimeout(() => this.createComet(), 5000);
  }
}
