import { LimitOrderData } from './LimitOrderData';

export interface ChartHorizontalLevels {
  high: ChartLevelData;
  low: ChartLevelData;
}

export interface ChartLevelData {
  value: number;
  time: number;
  touches: number;

  formation: boolean;
  a?: LimitOrderData[];
  b?: LimitOrderData[];
}

export type ChartLevel = [number, number, { touches: number }];
