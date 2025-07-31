import { Exchange } from '../../../../shared/models/Exchange';

export interface Listing {
  symbol: string;
  market: Exchange;
  created_at: Date;
}

export interface ListingOpenChartParams {
  symbol: string;
  exchange: Exchange;
}
