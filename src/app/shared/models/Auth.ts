import {PremiumLoyaltyDiscount} from "../components/premium/utils/models/PremiumLoyaltyDiscount";

export interface UserToken {
  refresh: string;
  access: string;
  new_user?: boolean;
}

export type AppTheme = 'dark' | 'light';

export interface UserPreferences {
  language: string;
  theme: AppTheme;
}

export interface UserData {
  id: number;
  user_id: number;
  username: string;
  email: string;
  created_at: string;
  balance?: number;
  premium_enabled: boolean;
  account_active?: boolean;
  premium_due_date: string;
  premium_package: string;
  special_discount: number;
  loyalty_discount: PremiumLoyaltyDiscount;
  partner_promocode?: string;
  partner_username?: string;
  special_functions: string;
  ref_access: boolean;
  bitget_uuid: string;
  vataga_uuid: string;
  locale?: string;
  binance_api_connected?: boolean;
}

export type AuthStatus = 'login' | 'register' | 'restore';
