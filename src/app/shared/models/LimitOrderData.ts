export interface LimitOrderData {
  price: number;
  quantity: number;
  full_price: number;
  distance: number;
  corrosion_time: number;
  timestamp: number;
  created_time: number;
  round: boolean;

  update?: LimitOrderData[];
}
