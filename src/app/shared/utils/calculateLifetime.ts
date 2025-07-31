import { LimitOrderData } from '../models/LimitOrderData';

export const calculateLifetime = (data: LimitOrderData): number => {
  let lifetimeMinutes = 0;
  const currentTimestamp: number = data.timestamp;
  const firstTimestamp: number = data.created_time;
  if (firstTimestamp) {
    const diffMs: number =
      new Date(currentTimestamp).valueOf() - new Date(firstTimestamp).valueOf();
    lifetimeMinutes = Math.round(diffMs / 1000 / 60);
  }
  return lifetimeMinutes;
};
