import {filter, Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';
import {
  periodRevenue,
  selectCoupons,
  selectPeriodCompletedWithdraw,
  selectPeriodInWorkWithdraw,
  selectReferrals,
  selectWithdraws,
} from './referrals.selectors';
import {Injectable} from '@angular/core';
import {ProfileReferral, ReferralCoupon, Withdraw,} from '../utils/models/referrals.model';
import {ReferralsActions} from './referrals.actions';
import {Actions} from "@ngrx/effects";

@Injectable({providedIn: 'root'})
export class ReferralsFacade {
  constructor(
    private store: Store,
    private actions: Actions
  ) {
  }

  public getPeriodRevenue(): Observable<number> {
    return this.store.select(periodRevenue);
  }

  public closeEditCouponDialog(): Observable<Action> {
    return this.actions.pipe(
      filter(action => action.type === ReferralsActions.createCouponSuccess.type || action.type === ReferralsActions.updateCouponSuccess.type)
    );
  }

  public loadReferrals(params: unknown): void {
    this.store.dispatch(ReferralsActions.loadReferrals({params}));
  }

  public getReferrals(): Observable<ProfileReferral[]> {
    return this.store.select(selectReferrals);
  }

  public loadCoupons(): void {
    this.store.dispatch(ReferralsActions.loadCoupons());
  }

  public getCoupons(): Observable<ReferralCoupon[]> {
    return this.store.select(selectCoupons);
  }

  public createCoupon(data: ReferralCoupon): void {
    this.store.dispatch(ReferralsActions.createCoupon({data}));
  }

  public removeCoupon(id: number): void {
    this.store.dispatch(ReferralsActions.removeCoupon({id}));
  }

  public updateCoupon(data: ReferralCoupon): void {
    this.store.dispatch(ReferralsActions.updateCoupon({data}));
  }

  public getPeriodCompletedWithdraw(): Observable<number> {
    return this.store.select(selectPeriodCompletedWithdraw);
  }

  public getPeriodInWorkWithdraw(): Observable<number> {
    return this.store.select(selectPeriodInWorkWithdraw);
  }

  public loadWithdraw(params: unknown): void {
    this.store.dispatch(ReferralsActions.loadWithdraws({params}));
  }

  public getWithdraws(): Observable<Withdraw[]> {
    return this.store.select(selectWithdraws);
  }

  public createWithdraw(data: Withdraw): void {
    this.store.dispatch(ReferralsActions.createWithdraw({data}));
  }
}
