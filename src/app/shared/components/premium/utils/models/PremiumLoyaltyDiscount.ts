export type PremiumLoyaltyDiscountType = 'loyalty' | 'repeat' | 'less2weeks' | 'more2weeks';

export interface PremiumLoyaltyDiscount {
  id: number;
  discount_type: PremiumLoyaltyDiscountType;
  percent: number;
  period: string;
  expires_at: string;
  is_applied: boolean;
}
