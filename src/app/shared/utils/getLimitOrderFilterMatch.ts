import { LimitOrderData } from '../models/LimitOrderData';
import { calculateLifetime } from './calculateLifetime';
import { ChartSettings } from '../models/ChartSettings';

export const filterLimitOrdersByFilterValue = (
  fullPrice: number,
  settings: ChartSettings,
): boolean => {
  const limitOrderFilter: number = settings.limitOrderFilter;
  return limitOrderFilter < fullPrice;
};

export const getLimitOrderFilterMatch = (
  data: LimitOrderData,
  settings: ChartSettings,
): boolean => {
  const priceCondition: boolean = filterLimitOrdersByFilterValue(
    data.full_price,
    settings,
  );
  const distanceCondition: boolean =
    data.distance <= settings.limitOrderDistance;
  const lifetimeCondition: boolean =
    Math.max(calculateLifetime(data), 0) >= settings.limitOrderLife;
  const corrosionTime: boolean =
    data.corrosion_time >= (settings.limitOrderCorrosionTime ?? 0);
  let round = settings.round_density ? data.round : true;
  return (
    priceCondition && distanceCondition && lifetimeCondition && corrosionTime && round
  );
};
