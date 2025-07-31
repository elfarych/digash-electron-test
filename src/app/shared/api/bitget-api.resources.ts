import { Injectable } from '@angular/core';
import { ExchangeCommonApiResources } from './exchange-common-api.resources';
import { Exchange } from '../models/Exchange';
import {
  CandlestickBitget,
  CandlestickVisualization,
} from '../models/Candlestick';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable, switchMap } from 'rxjs';
import { Timeframe } from '../models/Timeframe';
import { getExchangeAPI } from '../models/getExchangeAPI';
import { normalizeBitgetKlinesToCandlestick } from '../utils/normalizeKlinesToCandlestick';
import { bitgetIntervalConverter } from '../utils/bitgetIntervalConverter';

@Injectable({
  providedIn: 'root',
})
export class BitgetApiResources extends ExchangeCommonApiResources {
  constructor(private http: HttpClient) {
    super();
  }

  public getKlines(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe,
    limit: number,
    endTime: number = 0,
  ): Observable<CandlestickVisualization[]> {
    const bitgetInterval = bitgetIntervalConverter(interval, exchange);
    const baseUrl = getExchangeAPI(exchange);
    const path =
      exchange === 'BITGET_SPOT' || exchange === 'BITGET_SPOT_WITHOUT_BINANCE'
        ? `/spot/market/candles`
        : `/mix/market/candles`;

    let fullPath = `${baseUrl}${path}?symbol=${symbol}&granularity=${bitgetInterval}&limit=${limit}`;
    if (
      exchange === 'BITGET_FUTURES' ||
      exchange === 'BITGET_FUTURES_WITHOUT_BINANCE'
    ) {
      fullPath += '&productType=usdt-futures';
    }
    if (endTime) {
      fullPath += `&endTime=${endTime}`;
    }

    return from(fetch(fullPath)).pipe(
      switchMap((response) => from(response.json())),
      map((data) => {
        return normalizeBitgetKlinesToCandlestick(data as CandlestickBitget);
      }),
    );
  }

  public getKlinesMore(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe = '1m',
    limit = 200,
    endTime: number,
  ): Observable<CandlestickVisualization[]> {
    return this.getKlines(symbol, exchange, interval, limit, endTime);
  }
}
