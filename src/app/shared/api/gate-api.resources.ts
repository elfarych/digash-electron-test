import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Exchange } from '../models/Exchange';
import {
  CandlestickCommon,
  CandlestickGateFutures,
  CandlestickGateSpot,
  CandlestickIntervals,
  CandlestickVisualization,
} from '../models/Candlestick';
import { map, Observable } from 'rxjs';
import { getExchangeAPI } from '../utils/getExchangeAPI';
import {
  normalizeCommonKlinesToCandlestick,
  normalizeGateFuturesKlinesToCandlestick,
  normalizeGateSpotKlinesToCandlestick,
} from '../utils/normalizeKlinesToCandlestick';
import { environment } from 'src/environments/environment';
import { exchangeMapper } from '../utils/exchangeMapper';

@Injectable({
  providedIn: 'root',
})
export class GateApiResources {
  constructor(private http: HttpClient) {}

  public getKlines(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals,
    limit: number,
    endTime: number = 0,
  ): Observable<CandlestickVisualization[]> {
    const proxyUrl = `${environment.proxyUrl}/klines`;
    const fallbackUrl = `${getExchangeAPI(exchange)}/klines`;

    let fullPath = `${getExchangeAPI(exchange)}/candlesticks?interval=${interval}&limit=${limit}`;
    if (exchange === 'GATE_FUTURES') fullPath += `&contract=${symbol}`;
    if (exchange === 'GATE_SPOT') fullPath += `&currency_pair=${symbol}`;
    if (endTime) fullPath += `&to=${endTime}`;

    const params = new HttpParams()
      .set('symbol', symbol)
      .set('interval', interval)
      .set('limit', limit.toString())
      .set('exchange', exchangeMapper(exchange));

    return this.http
      .get<
        CandlestickGateSpot[] | CandlestickGateFutures[] | CandlestickCommon[]
      >(proxyUrl, { params })
      .pipe(
        map((data) => {
          if (exchange === 'GATE_SPOT')
            return normalizeCommonKlinesToCandlestick(
              data as CandlestickCommon[],
            );
          else
            return normalizeCommonKlinesToCandlestick(
              data as CandlestickCommon[],
            );
        }),
      );

    // return this.http
    //   .get<CandlestickGateSpot[] | CandlestickGateFutures[]>(fullPath)
    //   .pipe(
    //     map(data => {
    //       if (exchange === 'GATE_SPOT') return normalizeGateSpotKlinesToCandlestick(data as CandlestickGateSpot[])
    //       else return normalizeGateFuturesKlinesToCandlestick(data as CandlestickGateFutures[])
    //     }));
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
}
