export interface MovedPriceLevelEventDetails {
  alertId: number;
  newYValue: number;
}

export type MovedPriceLevelEvent = CustomEvent<MovedPriceLevelEventDetails>;
