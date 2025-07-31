import { Injectable } from '@angular/core';
import { Exchange } from '../models/Exchange';
import {
  CandlestickIntervals,
  CandlestickOkx,
  CandlestickVisualization,
} from '../models/Candlestick';
import { HttpClient } from '@angular/common/http';
import { getExchangeAPI } from '../utils/getExchangeAPI';
import { map, Observable } from 'rxjs';
import { normalizeOkxKlinesToCandlestick } from '../utils/normalizeKlinesToCandlestick';
import { okxIntervalConverter } from '../utils/okxIntervalConverter';

@Injectable({
  providedIn: 'root',
})
export class OkxApiResources {
  constructor(private http: HttpClient) {}

  public getKlines(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals,
    limit: number,
  ): Observable<CandlestickVisualization[]> {
    return this.http
      .get<CandlestickOkx>(
        `${getExchangeAPI(exchange)}/api/v5/market/candles`,
        {
          params: {
            instId: symbol,
            bar: okxIntervalConverter(interval),
            limit: limit > 300 ? 300 : limit,
          },
        },
      )
      .pipe(map((data) => normalizeOkxKlinesToCandlestick(data)));
  }

  public getKlinesMore(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals = '1m',
    limit: number = 200,
    endTime: number,
  ): Observable<CandlestickVisualization[]> {
    return this.http
      .get<CandlestickOkx>(
        `${getExchangeAPI(exchange)}/api/v5/market/candles`,
        {
          params: {
            instId: symbol,
            bar: okxIntervalConverter(interval),
            limit: limit > 300 ? 300 : limit,
            after: endTime,
          },
        },
      )
      .pipe(map((data) => normalizeOkxKlinesToCandlestick(data)));
  }
}
