import {
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
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom, interval, Observable, Subscription } from 'rxjs';
import { NewYearLightropeComponent } from '../new-year-lightrope/new-year-lightrope.component';
import { PremiumNewYearBallComponent } from '../premium-new-year-ball/premium-new-year-ball.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/data-access/auth.service';
import { PremiumResources } from '../../premium.resources';
import { UserData } from 'src/app/shared/models/Auth';
import { ButtonModule } from 'primeng/button';
import moment from 'moment-timezone';

@Component({
  selector: 'app-premium-new-year',
  standalone: true,
  imports: [
    CommonModule,
    PremiumNewYearBallComponent,
    NewYearLightropeComponent,
    TranslateModule,
    RouterLink,
    ButtonModule
  ],
  templateUrl: './premium-new-year.component.html',
  styleUrls: ['./premium-new-year.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumNewYearComponent implements OnInit, OnDestroy {
  @Output()
  public closeDialog: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public showClose: boolean = false;

  public mainBgImg = 'assets/img/new-year/premium-new-year-main-bg.png';
  public snowImg = 'assets/img/new-year/premium-new-year-snow.png';
  public lightImg = 'assets/img/new-year/premium-new-year-light.png';
  public mainCardDecorationImg = 'assets/img/new-year/main-card-decoration.png';
  public gerlandImg = 'assets/img/new-year/gerland.png';
  public remainingTime = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  };

  public premiumIsActive$ = this.authService.getPremiumIsActive();
  public userData$: Observable<UserData> = this.authService.getUserData();
  public processed = false;
  public errorMessage: string;

  private targetDate = new Date(new Date('2024-12-28').getTime() + (3 * 60 * 60 * 1000));
  private timerSubscription!: Subscription;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private authService: AuthService,
    private resources: PremiumResources,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.startTimer();
  }


  public ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  public allPlans(): void {
    this.router.navigate(['app', 'premium'])
    this.closeDialog.emit();
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
      this.errorMessage =
        'Упс, похоже, у нас возникли проблемы с вашим платежом. Пожалуйста, свяжитесь с нами по электронной почте.';
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

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.remainingTime = this.calculateTime('2024-12-28', 'Europe/Moscow');
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
    const minutes = duration.minutes().toString().padStart(2, '0');;
    const seconds = duration.seconds().toString().padStart(2, '0');;

    return { days, hours, minutes, seconds };
  }

  // private calculateTime(diff: number): {
  //   days: string;
  //   hours: string;
  //   minutes: string;
  //   seconds: string;
  // } {
  //   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  //   const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  //   return {
  //     days: this.padZero(days),
  //     hours: this.padZero(hours),
  //     minutes: this.padZero(minutes),
  //     seconds: this.padZero(seconds),
  //   };
  // }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
