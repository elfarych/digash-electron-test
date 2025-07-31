import { ChartIndicatorsProps } from './ChartIndicatorsProps';
import { defaultCoinDataProps } from './CoinData';

import { defaultRSIProps } from './RSI';
import { defaultOIProps } from './OI';
import { defaultATRProps } from './ATR';
import { TranslateService } from '@ngx-translate/core';
import { defaultUserTradesIndicatorProps } from './UserTrades';
import { defaultNotificationsStoryProps } from './NotificationsStory';
import { defaultLiquidationsBubblesProps } from './LiquidationsBubbles';
import { defaultSessionZonesProps } from './SessionZones';

export type ChartOfficialIndicators = 'CoinData' | 'SMA';

export interface ChartTechnicalIndicators {
  type: ChartTechnicalIndicatorTypes;
  name: ChartOfficialTechnicalIndicators;
  label: string;
  overlay: string;
  description?: string;
  onlyFutures?: boolean;
  onlyBinance?: boolean;
  clusters?: boolean;
  defaultActive?: boolean;
  hideOnWorkspace?: boolean;
  props: ChartIndicatorsProps;
}

export type ChartOfficialTechnicalIndicators =
  | 'RSI'
  | 'OI'
  | 'CoinData'
  | 'ATR'
  | 'UserTrades'
  | 'ATR'
  | 'NotificationsStory'
  | 'LiquidationBubbles'
  | 'SessionZones';

export type ChartTechnicalIndicatorTypes = 'overlay' | 'pane';

export const getWorkspaceIndicators = (
  translateService: TranslateService,
): ChartTechnicalIndicators[] => {
  return chartBasicTechnicalIndicatorsList(translateService).filter(
    (i) => !i.hideOnWorkspace,
  );
};

export const chartBasicTechnicalIndicatorsList = (
  translateService: TranslateService,
): ChartTechnicalIndicators[] => [
  {
    type: 'overlay',
    name: 'UserTrades',
    label: translateService.instant('technical_indicators.userTrades'),
    overlay: 'UserTrades',
    description: translateService.instant(
      'technical_indicators.userTradesDescription',
    ),
    props: defaultUserTradesIndicatorProps,
    onlyBinance: false,
    defaultActive: false,
  },
  {
    type: 'overlay',
    name: 'CoinData',
    label: translateService.instant('technical_indicators.coinData'),
    overlay: 'CoinData',
    description: translateService.instant(
      'technical_indicators.coinDataDescription',
    ),
    props: defaultCoinDataProps,
    onlyBinance: false,
    defaultActive: true,
  },
  {
    type: 'pane',
    name: 'OI',
    label: translateService.instant('technical_indicators.openInterest'),
    overlay: 'Spline',
    description: translateService.instant(
      'technical_indicators.openInterestDescription',
    ),
    props: defaultOIProps,
    onlyFutures: true,
    hideOnWorkspace: true,
  },
  {
    type: 'pane',
    name: 'RSI',
    label: translateService.instant('technical_indicators.rsi'),
    overlay: 'Range',
    description: translateService.instant(
      'technical_indicators.rsiDescription',
    ),
    props: defaultRSIProps,
  },
  {
    type: 'pane',
    name: 'ATR',
    label: translateService.instant('technical_indicators.atr'),
    overlay: 'Spline',
    description: translateService.instant(
      'technical_indicators.atrDescription',
    ),
    props: defaultATRProps,
  },
  {
    type: 'overlay',
    name: 'NotificationsStory',
    label: translateService.instant('technical_indicators.notifications'),
    overlay: 'NotificationsStory',
    description: translateService.instant(
      'technical_indicators.notificationsDescription',
    ),
    props: defaultNotificationsStoryProps,
    onlyBinance: false,
  },
  {
    type: 'overlay',
    name: 'LiquidationBubbles',
    label: translateService.instant('technical_indicators.liquidationBubbles'),
    overlay: 'Bubbles',
    description: translateService.instant(
      'technical_indicators.liquidationBubblesDescription',
    ),
    onlyFutures: true,
    props: defaultLiquidationsBubblesProps,
  },
  {
    type: 'overlay',
    name: 'SessionZones',
    label: translateService.instant('technical_indicators.SessionZones'),
    overlay: 'SessionZones',
    description: translateService.instant(
      'technical_indicators.SessionZonesDescription',
    ),
    onlyFutures: false,
    props: defaultSessionZonesProps,
  },
];
