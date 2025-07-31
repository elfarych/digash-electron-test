import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {ReferralsActions} from './referrals.actions';
import {catchError, EMPTY, map, mergeMap, switchMap, withLatestFrom,} from 'rxjs';
import {ReferralsFacade} from './referrals.facade';
import {ReferralsResources} from './referrals.resources';
import {ReferralCoupon, Withdraw} from '../utils/models/referrals.model';
import {selectCoupons, selectWithdraws} from './referrals.selectors';
import {WithdrawHelperService} from '../utils/withdraw-helper.service';

@Injectable()
export class ReferralsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private service: ReferralsFacade,
    private resources: ReferralsResources,
    private withdrawHelperService: WithdrawHelperService,
  ) {
  }

  private loadReferrals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.loadReferrals),
      switchMap((params) =>
        this.resources.loadReferrals(params).pipe(
          map((data) => ReferralsActions.loadReferralsSuccess({data})),
          catchError(() => {
            ReferralsActions.loadReferralsError({
              errorMessage: 'Ошибка загрузки данных',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private updateReferralsPeriodRevenue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.loadReferralsSuccess),
      map(({data}) =>
        ReferralsActions.updatePeriodRevenue({
          value: data.reduce((acc, coupon) => acc + coupon.revenue, 0),
        }),
      ),
    ),
  );

  private loadCoupons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.loadCoupons),
      switchMap(() =>
        this.resources.loadCoupons().pipe(
          map((data: ReferralCoupon[]) =>
            ReferralsActions.loadCouponsSuccess({data}),
          ),
          catchError(() => {
            ReferralsActions.createCouponError({
              errorMessage: 'Ошибка загрузки данных',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private createCoupon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.createCoupon),
      switchMap(({data}) =>
        this.resources.createCoupon(data).pipe(
          map((data) => ReferralsActions.createCouponSuccess({data})),
          catchError(() => {
            ReferralsActions.createCouponError({
              errorMessage: 'Ошибка загрузки данных',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private removeCoupon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.removeCoupon),
      switchMap(({id}) =>
        this.resources.removeCoupon(id).pipe(
          map((data) => ReferralsActions.removeCouponSuccess(),
            catchError(() => {
              ReferralsActions.removeCouponError({
                errorMessage: 'Ошибка загрузки данных',
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    )
  );

  private updateCoupon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.updateCoupon),
      switchMap(({data}) =>
        this.resources.updateCoupon(data).pipe(
          map((data) => ReferralsActions.updateCouponSuccess({data})),
          catchError(() => {
            ReferralsActions.updateCouponError({
              errorMessage: 'Ошибка загрузки данных',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private updateCouponsListAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.createCouponSuccess),
      withLatestFrom(this.store.select(selectCoupons)),
      map(([{data: newCoupon}, coupons]) => {
        return ReferralsActions.updateCouponsList({
          data: [newCoupon, ...coupons],
        });
      }),
    ),
  );

  private updateCouponsListAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.updateCouponSuccess),
      withLatestFrom(this.store.select(selectCoupons)),
      map(([{data: newCoupon}, coupons]) => {
        return ReferralsActions.updateCouponsList({
          data: coupons.map((c) => (c.id === newCoupon.id ? newCoupon : c)),
        });
      }),
    ),
  );

  private loadWithdraws$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.loadWithdraws),
      switchMap((params) =>
        this.resources.loadWithdraws(params).pipe(
          map((data: Withdraw[]) =>
            ReferralsActions.loadWithdrawsSuccess({data}),
          ),
          catchError(() => {
            ReferralsActions.createWithdrawError({
              errorMessage: 'Ошибка загрузки данных',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private createWithdraw$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.createWithdraw),
      switchMap(({data}) =>
        this.resources.createWithdraw(data).pipe(
          map((data) => ReferralsActions.createWithdrawSuccess({data})),
          catchError(() => {
            ReferralsActions.createWithdrawError({
              errorMessage: 'Ошибка загрузки данных',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private updateWithdrawList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferralsActions.createWithdrawSuccess),
      withLatestFrom(this.store.select(selectWithdraws)),
      map(([{data: newWithdraw}, withdraws]) => {
        return ReferralsActions.updateWithdrawsList({
          data: [newWithdraw, ...withdraws],
        });
      }),
    ),
  );

  private updatePeriodWithdrawTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReferralsActions.loadWithdrawsSuccess,
        ReferralsActions.updateWithdrawsList,
      ),
      map(({data}) => [
        ReferralsActions.updatePeriodCompletedWithdraw({
          value: this.withdrawHelperService.getCompletedWithdrawsTotalSum(data),
        }),
        ReferralsActions.updatePeriodInWorkWithdraw({
          value: this.withdrawHelperService.getInWorkWithdrawsTotalSum(data),
        }),
      ]),
      mergeMap((actions) => actions),
    ),
  );
}
