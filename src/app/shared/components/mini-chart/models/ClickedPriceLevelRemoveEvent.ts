export interface ClickedPriceLevelRemoveEventDetails {
  alertId: number;
}

export type ClickedPriceLevelRemoveEvent =
  CustomEvent<ClickedPriceLevelRemoveEventDetails>;
