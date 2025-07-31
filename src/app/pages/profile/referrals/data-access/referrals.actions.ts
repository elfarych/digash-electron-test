import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {ProfileReferral, ReferralCoupon, Withdraw,} from '../utils/models/referrals.model';

export const ReferralsActions = createActionGroup({
  source: 'Referrals actions',
  events: {
    'Load referrals': props<{ params: unknown }>(),
    'Load referrals success': props<{ data: ProfileReferral[] }>(),
    'Load referrals error': props<{ errorMessage: string }>(),

    'Load coupons': emptyProps(),
    'Load coupons success': props<{ data: ReferralCoupon[] }>(),
    'Load coupons error': props<{ errorMessage: string }>(),

    'Create coupon': props<{ data: ReferralCoupon }>(),
    'Create coupon success': props<{ data: ReferralCoupon }>(),
    'Create coupon error': props<{ errorMessage: string }>(),

    'Remove coupon': props<{ id: number }>(),
    'Remove coupon success': emptyProps(),
    'Remove coupon error': props<{ errorMessage: string }>(),

    'Update coupon': props<{ data: ReferralCoupon }>(),
    'Update coupon success': props<{ data: ReferralCoupon }>(),
    'Update coupons list': props<{ data: ReferralCoupon[] }>(),
    'Update coupon error': props<{ errorMessage: string }>(),

    'Load withdraws': props<{ params: unknown }>(),
    'Load withdraws success': props<{ data: Withdraw[] }>(),
    'Load withdraws error': props<{ errorMessage: string }>(),

    'Create withdraw': props<{ data: Withdraw }>(),
    'Create withdraw success': props<{ data: Withdraw }>(),
    'Create withdraw error': props<{ errorMessage: string }>(),

    'Update withdraws list': props<{ data: Withdraw[] }>(),

    'Update period completed withdraw': props<{ value: number }>(),
    'Update period in work withdraw': props<{ value: number }>(),
    'Update period revenue': props<{ value: number }>()
  },
});
