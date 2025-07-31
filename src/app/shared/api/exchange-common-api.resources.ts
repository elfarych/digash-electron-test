import { Exchange } from '../models/Exchange';
import { CandlestickVisualization } from '../models/Candlestick';
import { Observable } from 'rxjs';
import { Timeframe } from '../models/Timeframe';

export abstract class ExchangeCommonApiResources {
  public abstract getKlines(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe,
    limit: number,
  ): Observable<CandlestickVisualization[]>;

  public abstract getKlinesMore(
    symbol: string,
    exchange: Exchange,
    interval: string,
    limit: number,
    endTime: number,
  ): Observable<CandlestickVisualization[]>;
}
