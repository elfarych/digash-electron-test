import { ReferralsFacade } from '../../data-access/referrals.facade';
import {
  ProfileReferral,
  ReferralCoupon,
  ReferralDataPeriod,
  Withdraw,
} from '../../utils/models/referrals.model';
import { filter, map, Observable, take, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { selectUserData } from '../../../../../auth/data-access/auth.selectors';
import { UserData } from '../../../../../shared/models/Auth';
import { Action, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  setReferralFriendId,
  setReferralId,
} from 'src/app/shared/utils/ReferralLocalStorage';

@Injectable({ providedIn: 'root' })
export class ReferralsService {
  constructor(
    private facade: ReferralsFacade,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public getCloseEditCouponDialog(): Observable<Action> {
    return this.facade.closeEditCouponDialog();
  }

  public getUser(): Observable<UserData> {
    return this.store.select(selectUserData);
  }

  public getPeriodRevenue(): Observable<number> {
    return this.facade.getPeriodRevenue();
  }

  public loadReferrals(period: ReferralDataPeriod): void {
    this.facade.loadReferrals({
      created_at: this.getStartDateFromPeriod(period),
    });
  }

  public getReferrals(): Observable<ProfileReferral[]> {
    return this.facade.getReferrals();
  }

  public loadCoupons(): void {
    this.facade.loadCoupons();
  }

  public getCoupons(): Observable<ReferralCoupon[]> {
    return this.facade.getCoupons();
  }

  public createCoupon(data: ReferralCoupon): void {
    this.facade.createCoupon(data);
  }

  public removeCoupon(id: number): void {
    this.facade.removeCoupon(id);
  }

  public updateCoupon(data: ReferralCoupon): void {
    this.facade.updateCoupon(data);
  }

  public getPeriodCompletedWithdraw(): Observable<number> {
    return this.facade.getPeriodCompletedWithdraw();
  }

  public getPeriodInWorkWithdraw(): Observable<number> {
    return this.facade.getPeriodInWorkWithdraw();
  }

  public loadWithdraw(period: ReferralDataPeriod): void {
    this.facade.loadWithdraw({
      created_at: this.getStartDateFromPeriod(period),
    });
  }

  public getWithdraws(): Observable<Withdraw[]> {
    return this.facade.getWithdraws();
  }

  public createWithdraw(data: Withdraw): void {
    this.facade.createWithdraw(data);
  }

  public handleReferralSession(): void {
    this.route.queryParams
      .pipe(
        filter((params) => params?.['partner']),
        map((params) => params['partner']),
        take(1),
        tap((host: string) => setReferralId(host)),
      )
      .subscribe((a) => console.log(a));
  }

  public handleReferralFriendSession(): void {
    this.route.queryParams
      .pipe(
        filter((params) => params?.['ref_id']),
        map((params) => params['ref_id']),
        take(1),
        tap(() =>
          this.router.navigate([], { relativeTo: this.route, queryParams: {} }),
        ),
        tap((host: string) => setReferralFriendId(host)),
      )
      .subscribe((a) => console.log(a));
  }

  private getStartDateFromPeriod(
    period: ReferralDataPeriod,
  ): string | undefined {
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const earliestDate = new Date(0);

    switch (period) {
      case 'today':
        return now.toISOString();
      case 'week':
        startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        return startOfWeek.toISOString();
      case 'month':
        return startOfMonth.toISOString();
      case 'all':
        return earliestDate.toISOString();
      default:
        return now.toISOString();
    }
  }
}
