import { LimitOrderData } from '../models/LimitOrderData';
import { getLimitOrderFilterMatch } from './getLimitOrderFilterMatch';
import { Workspace } from '../models/Workspace';
import { ChartSettings } from '../models/ChartSettings';

export const filterLimitOrders = (
  data: LimitOrderData[],
  settings: ChartSettings,
): LimitOrderData[] => {
  return data.filter((value) => getLimitOrderFilterMatch(value, settings));
};
