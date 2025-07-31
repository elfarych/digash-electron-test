export interface UserTradesData {
  symbol: string;
  id: number;
  orderId: number;
  side: 'BUY' | 'SELL';
  price: string;
  qty: string;
  realizedPnl: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  positionSide: 'BOTH' | 'LONG' | 'SHORT';
  buyer: boolean;
  maker: boolean;
}

export interface UserTradesProcessedData {
  symbol: string;
  pnl: number;
  pricePrecision: number;
  openPrice: number;
  closePrice?: number;
  openTime: number;
  closeTime?: number;
  positionClosed: boolean;
  openQty?: number;
  closeQty?: number;
  trades: UserTradesData[];
}
