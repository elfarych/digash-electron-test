export type AppFunctionTooltipIdentifier =
  | 'WORKSPACES'
  | 'HORIZONTAL_LEVELS'
  | 'TREND_LEVELS'
  | 'DENSITIES'
  | 'PREFERENCES'
  | 'INDICATORS'
  | 'SORTING'
  | 'FILTERING'
  | 'FORMATIONS'
  | 'BLACKLIST'
  | 'LISTINGS'
  | 'VOLUME_FILTER'
  | 'TRADES_FILTER'
  | 'CORRELATION_FILTER'
  | 'PRICE_CHANGE_FILTER'
  | 'NAVIGATION_SETTING_FILTERS'
  | 'NAVIGATION_SETTING_COLUMNS'
  | 'NAVIGATION_SETTING_COLUMNS_VOLUME'
  | 'NAVIGATION_SETTING_COLUMNS_VOLUME_SPLASH'
  | 'NAVIGATION_SETTING_COLUMNS_PRICE'
  | 'NAVIGATION_SETTING_COLUMNS_CORRELATION'
  | 'NAVIGATION_SETTING_COLUMNS_VOLATILITY'
  | 'NAVIGATION_SETTING_COLUMNS_TRADES'
  | 'NAVIGATION_SETTING_COLUMNS_HORIZONTAL_LEVELS'
  | 'NAVIGATION_SETTING_COLUMNS_TREND_LEVELS'
  | 'ACTIVE_COINS'
  | 'ALERTS_PAGE_BASE_SETTINGS'
  | 'ALERTS_PAGE_ALL_ALERTS'
  | 'ALERTS_PAGE_PRICE_ALERTS'
  | 'ALERTS_PAGE_LIMIT_ORDER_ALERTS'
  | 'ALERTS_PAGE_PRICE_CHANGE_ALERTS'
  | 'ALERTS_PAGE_CORRELATION_ALERTS'
  | 'ALERTS_PAGE_VOLATILITY_ALERTS'
  | 'PSYCHOLOGY'
  | 'EXCHANGE_API_KEY_SETUP'
  | 'INVITE_FRIEND';

export interface AppFunctionTooltip {
  title: string;
  title_en?: string;
  title_hi?: string;
  title_bn?: string;
  title_uk?: string;
  image: string;
  content: string;
  content_en?: string;
  content_hi?: string;
  content_bn?: string;
  content_uk?: string;
  identifier: AppFunctionTooltipIdentifier;
}
