import { createReducer, on } from '@ngrx/store';
import { ReferralsActions } from './referrals.actions';
import {
  ProfileReferral,
  ReferralCoupon,
  Withdraw,
} from '../utils/models/referrals.model';

export interface ReferralsState {
  referralsLoading: boolean;
  couponsLoading: boolean;
  periodRevenue: number;
  periodCompletedWithdraw: number;
  periodInWorkWithdraw: number;
  referrals: ProfileReferral[];
  coupons: ReferralCoupon[];
  withdraws: Withdraw[];
}

const initialReferralsState: ReferralsState = {
  referralsLoading: true,
  couponsLoading: true,
  periodRevenue: 0,
  periodCompletedWithdraw: 0,
  periodInWorkWithdraw: 0,
  referrals: [],
  coupons: [],
  withdraws: [],
};

export const referralsReducer = createReducer(
  initialReferralsState,

  on(
    ReferralsActions.updatePeriodRevenue,
    (state: ReferralsState, { value }): ReferralsState => {
      return {
        ...state,
        periodRevenue: value,
      };
    },
  ),

  on(
    ReferralsActions.loadReferrals,
    (state: ReferralsState): ReferralsState => {
      return {
        ...state,
        referralsLoading: true,
      };
    },
  ),

  on(
    ReferralsActions.loadReferralsSuccess,
    (state: ReferralsState, { data }): ReferralsState => {
      return {
        ...state,
        referralsLoading: false,
        referrals: data,
      };
    },
  ),

  on(
    ReferralsActions.loadReferralsError,
    (state: ReferralsState): ReferralsState => {
      return {
        ...state,
        referralsLoading: false,
      };
    },
  ),

  on(ReferralsActions.loadCoupons, (state: ReferralsState) => {
    return {
      ...state,
      couponsLoading: true,
    };
  }),

  on(ReferralsActions.loadCouponsError, (state: ReferralsState) => {
    return {
      ...state,
      couponsLoading: false,
    };
  }),

  on(ReferralsActions.removeCoupon, (state: ReferralsState, {id}) => {
    return {
      ...state,
      couponsLoading: true,
      coupons: state.coupons.filter(coupon => coupon.id !== id)
    };
  }),

  on(ReferralsActions.removeCouponError, (state: ReferralsState) => {
    return {
      ...state,
      couponsLoading: false,
    };
  }),

  on(ReferralsActions.removeCouponSuccess, (state: ReferralsState) => {
    return {
      ...state,
      couponsLoading: false
    };
  }),

  on(ReferralsActions.loadCouponsSuccess, (state: ReferralsState, { data }) => {
    return {
      ...state,
      coupons: data,
      couponsLoading: false,
    };
  }),

  on(ReferralsActions.updateCouponsList, (state: ReferralsState, { data }) => {
    return {
      ...state,
      coupons: data,
    };
  }),

  on(
    ReferralsActions.loadWithdrawsSuccess,
    (state: ReferralsState, { data }) => {
      return {
        ...state,
        withdraws: data,
      };
    },
  ),

  on(
    ReferralsActions.updateWithdrawsList,
    (state: ReferralsState, { data }) => {
      return {
        ...state,
        withdraws: data,
      };
    },
  ),

  on(
    ReferralsActions.updatePeriodCompletedWithdraw,
    (state: ReferralsState, { value }) => {
      return {
        ...state,
        periodCompletedWithdraw: value,
      };
    },
  ),

  on(
    ReferralsActions.updatePeriodInWorkWithdraw,
    (state: ReferralsState, { value }) => {
      return {
        ...state,
        periodInWorkWithdraw: value,
      };
    },
  ),
);
