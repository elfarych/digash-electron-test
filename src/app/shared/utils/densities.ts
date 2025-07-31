import { WorkspaceCoins } from '../models/WorkspaceCoins';
import { LimitOrderData } from '../models/LimitOrderData';

export type DensitySortField = 'size' | 'distance' | 'corrosionTime';

export interface Density {
  symbol: string;
  size: number;
  distance: number;
  weight: number;
  corrosionTime: number;
  created_time: number;
  type: 'ask' | 'bid';
}

export interface DensitiesFilterValues {
  corrosionTime: number;
  distance: number;
  lifeTime: number;
  size: number;
}

const getLimitOrderLifeTimeMinutes = (timestamp: number): number => {
  const now = Date.now();
  const difference = now - timestamp;
  return Math.floor(difference / 60000);
};

export const convertLimitOrdersToDensities = (
  symbol: string,
  orders: LimitOrderData[],
  type: 'ask' | 'bid',
): Density[] => {
  return orders.map((o) => ({
    symbol,
    type,
    corrosionTime: o.corrosion_time,
    size: o.full_price,
    distance: Math.max(0, o.distance),
    created_time: o.created_time,
    weight: 1, // Пока не используется
  }));
};

export const convertWorkspaceToDensities = (
  coins: WorkspaceCoins[],
): Density[] => {
  let result: Density[] = [];
  for (const coin of coins) {
    const asks = coin.data?.a ?? [];
    const bids = coin.data?.b ?? [];

    result = [
      ...result,
      ...convertLimitOrdersToDensities(coin.symbol, asks, 'ask'),
      ...convertLimitOrdersToDensities(coin.symbol, bids, 'bid'),
    ];
  }

  return result;
};

export const filterDensities = (
  densities: Density[],
  filters: DensitiesFilterValues,
): Density[] => {
  return densities.filter((d) => {
    const distanceCondition = d.distance <= filters.distance;
    const lifeTimeCondition =
      getLimitOrderLifeTimeMinutes(d.created_time) >= filters.lifeTime;
    const corrosionCondition = d.corrosionTime >= filters.corrosionTime;
    const sizeCondition = d.size >= filters.size;
    return (
      distanceCondition &&
      lifeTimeCondition &&
      corrosionCondition &&
      sizeCondition
    );
  });
};

export const sortDensities = (
  field: DensitySortField,
  densities: Density[],
): Density[] => {
  switch (field) {
    case 'corrosionTime':
      return densities.sort((a, b) => b.corrosionTime - a.corrosionTime);

    case 'size':
      return densities.sort((a, b) => b.size - a.size);

    default:
      return densities.sort((a, b) => a.distance - b.distance);
  }
};
