import { LimitOrderLocation } from './LimitOrderLocation';

export interface HorizontalLevelWithLimitOrderForm {
  formationLimitOrderLevelDistance: number;
  formationLimitOrderLevelLocation: LimitOrderLocation;
  formationLevelTouches: number;
  formationLevelTouchesThreshold: number;
}

export const defaultHorizontalLevelWithLimitOrderForm: HorizontalLevelWithLimitOrderForm =
  {
    formationLimitOrderLevelDistance: 0.5,
    formationLimitOrderLevelLocation: 'none',
    formationLevelTouches: 0,
    formationLevelTouchesThreshold: 0.5,
  };
