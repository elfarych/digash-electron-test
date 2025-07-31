import { PremiumPeriod } from '../../../models/PremiumPeriod';

export interface PriceList {
  period: PremiumPeriod;
  user_price: number;
  price: number;
  discount_percent: number;
  default_discount: number;
  price_per_month: number | null;
  special_discount_title: string;
  period_discount: number | null;
  info: {
    label: string;
    period: string;
  };
}
