import { OverlayData } from 'night-vision/dist/types';
import { UserTradesProcessedData } from '../../api/user-trades-data/user-trades-data.models';

import {
  defaultUserTradesIndicatorProps,
  UserTradesIndicatorProps,
} from '../../models/chart-indicators/UserTrades';

export const calculateUserTradesData = (
  props: UserTradesIndicatorProps = defaultUserTradesIndicatorProps,
  trades: UserTradesProcessedData[],
): OverlayData => {
  return trades as unknown as OverlayData;
};
