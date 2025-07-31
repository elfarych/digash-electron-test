import { UserTradesProcessedData } from '../../api/user-trades-data/user-trades-data.models';
import { OverlayData } from 'night-vision/dist/types';
import { UserTradesIndicatorProps } from '../../models/chart-indicators/UserTrades';
import { calculateOI } from './calculateOI';
import { OIProps } from '../../models/chart-indicators/OI';
import { OpenInterest } from '../../models/OpenInterest';
import { calculateCoinData } from './calculateCoinData';
import { CoinDataProps } from '../../models/chart-indicators/CoinData';
import { ATRProps } from '../../models/chart-indicators/ATR';
import { calculateATR } from './calculateATR';
import { CoinData } from '../../models/CoinData';
import { RSIProps } from '../../models/chart-indicators/RSI';
import { calculateRSI } from './calculateRSI';
import { calculateUserTradesData } from './calculateUserTrades';
import { CandlestickIntervals } from '../../models/Candlestick';
import { convertHistoricalNotificationsToOverlayData } from './convertHistoricalNotificationsToOverlay';
import { AlertNotification } from '../../models/Notification';
import { LiquidationsBubblesProps } from '../../models/chart-indicators/LiquidationsBubbles';
import { calculateLiquidationsBubbles } from './calculateLiquidationsBubbles';
import { Liquidation } from '../Liquidation';
import { ChartTechnicalIndicators } from '../../models/chart-indicators/ChartIndicators';

export interface ScriptCalculatorParams {
  type: ChartTechnicalIndicators;
  candlesData: number[][];
  precision: number;
  openInterestData?: OpenInterest[];
  symbolData?: CoinData;
  userTrades?: UserTradesProcessedData[];
  notifications?: AlertNotification[];
  timeframe?: CandlestickIntervals;
  liquidationsData?: { [tick: string]: Liquidation };
}

export const scriptsCalculator = ({
  type,
  candlesData,
  precision,
  openInterestData,
  symbolData,
  userTrades,
  notifications,
  timeframe,
  liquidationsData,
}: ScriptCalculatorParams): OverlayData => {
  switch (type.name) {
    case 'RSI':
      return calculateRSI(type.props as RSIProps, candlesData);
    case 'CoinData':
      return calculateCoinData(type.props as CoinDataProps, symbolData);
    case 'OI':
      return calculateOI(type.props as OIProps, candlesData, openInterestData);
    case 'ATR':
      return calculateATR(type.props as ATRProps, candlesData, precision);
    case 'UserTrades':
      return calculateUserTradesData(
        type.props as UserTradesIndicatorProps,
        userTrades,
      );
    case 'NotificationsStory':
      return convertHistoricalNotificationsToOverlayData(
        notifications ?? [],
        timeframe ?? '5m',
      );
    case 'LiquidationBubbles':
      return calculateLiquidationsBubbles(
        type.props as LiquidationsBubblesProps,
        symbolData?.volume_data,
        liquidationsData,
        precision,
      );
    case 'SessionZones':
      return [];
  }

  return candlesData as unknown as OverlayData;
};
