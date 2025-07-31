import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReferralsState } from './referrals.reducer';

export const referralsFeature =
  createFeatureSelector<ReferralsState>('referrals');

export const periodRevenue = createSelector(
  referralsFeature,
  (state: ReferralsState) => state.periodRevenue,
);

export const selectReferrals = createSelector(
  referralsFeature,
  (state: ReferralsState) => state.referrals,
);

export const selectCoupons = createSelector(
  referralsFeature,
  (state: ReferralsState) => state.coupons,
);

export const selectWithdraws = createSelector(
  referralsFeature,
  (state: ReferralsState) => state.withdraws,
);

export const selectPeriodCompletedWithdraw = createSelector(
  referralsFeature,
  (state: ReferralsState) => state.periodCompletedWithdraw,
);

export const selectPeriodInWorkWithdraw = createSelector(
  referralsFeature,
  (state: ReferralsState) => state.periodInWorkWithdraw,
);
