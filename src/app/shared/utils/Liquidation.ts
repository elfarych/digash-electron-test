export interface Liquidation {
  price: number;
  quantity: number;
  averagePrice: number;
  eventTime: number;
  side: 'BUY' | 'SELL'
}
