export interface ClickedLimitOrderEventDetails {
  asks: boolean;
  corrosion_time: number;
  created_time: number;
  distance: number;
  full_price: number;
  price: number;
  timestamp: number;
  type: string;
  quantity: number;
  x: number;
  y: number;
}

export type ClickedLimitOrderEvent = CustomEvent<ClickedLimitOrderEventDetails>;
