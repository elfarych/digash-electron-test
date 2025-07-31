import { MexcFuturesApiResources } from './mexc-futures-api.resources';
import { MexcSpotApiResources } from './mexc-spot-api.resources';
import { Exchange } from '../../models/Exchange';
import {
  CandlestickIntervals,
  CandlestickVisualization,
} from '../../models/Candlestick';
import { Timeframe } from '../../models/Timeframe';
import { Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MexcApiResources {
  constructor(
    private readonly spotApi: MexcSpotApiResources,
    private readonly futuresApi: MexcFuturesApiResources,
  ) {}

  public getKlines(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe,
    limit: number,
    endTime: number = 0,
  ): Observable<CandlestickVisualization[]> {
    if (exchange === 'MEXC_FUTURES') {
      return this.futuresApi.getKlines(
        symbol,
        exchange,
        interval,
        limit,
        endTime,
      );
    } else {
      return this.spotApi.getKlines(symbol, exchange, interval, limit, endTime);
    }
  }

  public getKlinesMore(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals = '1m',
    limit: number = 200,
    endTime: number,
  ): Observable<CandlestickVisualization[]> {
    return this.getKlines(symbol, exchange, interval, limit, endTime);
  }

  public setupWebsocket(
    exchange: Exchange,
    symbol: string,
    interval: CandlestickIntervals,
  ): WebSocketSubject<CandlestickVisualization> {
    if (exchange === 'MEXC_FUTURES') {
      return this.futuresApi.setupWebsocket(exchange, symbol, interval);
    } else {
      return this.spotApi.setupWebsocket(exchange, symbol, interval);
    }
  }
}
