import { ChartIndicatorsProps } from '../models/chart-indicators/ChartIndicatorsProps';
import { ChartTechnicalIndicators } from '../models/chart-indicators/ChartIndicators';
import { defaultCoinDataProps } from '../models/chart-indicators/CoinData';
import { defaultRSIProps } from '../models/chart-indicators/RSI';
import { defaultOIProps } from '../models/chart-indicators/OI';
import { defaultATRProps } from '../models/chart-indicators/ATR';
import { defaultUserTradesIndicatorProps } from '../models/chart-indicators/UserTrades';
import { defaultSessionZonesProps } from '../models/chart-indicators/SessionZones';
import { defaultLiquidationsBubblesProps } from '../models/chart-indicators/LiquidationsBubbles';

export const getTechnicalIndicatorDefaultProps = (
  type: ChartTechnicalIndicators,
): ChartIndicatorsProps => {
  switch (type.name) {
    case 'RSI':
      return defaultRSIProps;
    case 'OI':
      return defaultOIProps;
    case 'CoinData':
      return defaultCoinDataProps;
    case 'ATR':
      return defaultATRProps;
    case 'UserTrades':
      return defaultUserTradesIndicatorProps;
    case 'SessionZones':
      return defaultSessionZonesProps;
    case 'LiquidationBubbles':
      return defaultLiquidationsBubblesProps;
  }

  return void 0;
};
