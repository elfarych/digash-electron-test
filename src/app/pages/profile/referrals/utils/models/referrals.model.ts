import { DropdownOptions } from '../../../../../shared/types/base.types';

export interface ReferralCoupon {
  id?: number;
  code: string;
  revenue: number;
  discount: {
    value: number;
    is_percentage: boolean;
  };
  partner_orders: ReferralPartnerOrder[];
}

export interface ReferralPartnerOrder {
  id: number;
  revenue: number;
}

export interface ProfileReferral {
  coupon: ReferralCoupon;
  revenue: number;
  discount: number;
  price: number;
  created_at: string;
  from_broker_commission_order: boolean;
  broker_type: string;
}

export interface Withdraw {
  sum: number;
  completed: boolean;
  canceled: boolean;
  comment?: string;
  created_at?: string;
}

export type ReferralDataPeriod = 'today' | 'week' | 'month' | 'all';

export const referralsDataPeriodOptions: DropdownOptions<ReferralDataPeriod> = [
  { label: 'forToday', value: 'today' },
  { label: 'forWeek', value: 'week' },
  { label: 'forMonth', value: 'month' },
  { label: 'forAllTime', value: 'all' },
];
