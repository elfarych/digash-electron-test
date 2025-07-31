import { Injectable } from '@angular/core';
import { ExchangeCommonApiResources } from './exchange-common-api.resources';
import { Exchange } from '../models/Exchange';
import {
  CandlestickBybit,
  CandlestickVisualization,
} from '../models/Candlestick';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Timeframe } from '../models/Timeframe';
import {
  getExchangeAPI,
  getExchangeOpenInterestAPI,
} from '../models/getExchangeAPI';
import { bybitIntervalConverter } from '../utils/bybitIntervalConverter';
import { normalizeBybitKlinesToCandlestick } from '../utils/normalizeKlinesToCandlestick';
import { OpenInterest } from '../models/OpenInterest';
import { BybitOpenInterest } from '../models/BybitOpenInterest';
import { normalizeBybitOpenInterest } from '../utils/normalizeOpenInterest';

@Injectable({
  providedIn: 'root',
})
export class BybitApiResources extends ExchangeCommonApiResources {
  constructor(private http: HttpClient) {
    super();
  }

  public getKlines(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe,
    limit: number,
  ): Observable<CandlestickVisualization[]> {
    // return this.http.get<CandlestickCommon[]>(`http://localhost:3000/api/klines`, {
    //   params: {
    //     symbol,
    //     interval,
    //     limit,
    //     exchange: exchangeMapper(exchange)
    //   }
    // }).pipe(map((data) => normalizeCommonKlinesToCandlestick(data)));

    return this.http
      .get<CandlestickBybit>(`${getExchangeAPI(exchange)}/kline`, {
        params: {
          category: this.getCategory(exchange),
          symbol,
          interval: bybitIntervalConverter(interval),
          limit,
        },
      })
      .pipe(map((data) => normalizeBybitKlinesToCandlestick(data)));
  }

  public getKlinesMore(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe = '1m',
    limit = 200,
    endTime: number,
  ): Observable<CandlestickVisualization[]> {
    return this.http
      .get<CandlestickBybit>(`${getExchangeAPI(exchange)}/kline`, {
        params: {
          category: this.getCategory(exchange),
          symbol,
          interval: bybitIntervalConverter(interval),
          limit,
          end: endTime,
        },
      })
      .pipe(map((data) => normalizeBybitKlinesToCandlestick(data)));
  }

  private getOriginalKlinesData(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe = '1m',
    limit = 500,
  ): Observable<CandlestickBybit> {
    return this.http.get<CandlestickBybit>(
      `${getExchangeAPI(exchange)}/kline`,
      {
        params: {
          category: this.getCategory(exchange),
          symbol,
          interval: bybitIntervalConverter(interval),
          limit,
        },
      },
    );
  }

  private getCategory(exchange: Exchange): 'spot' | 'linear' {
    if (exchange === 'BYBIT_SPOT') {
      return 'spot';
    }

    return 'linear';
  }

  public getOpenInterestData(
    symbol: string,
    exchange: Exchange,
    period: Timeframe = '5m',
    limit: number = 200,
    endTime?: number,
  ): Observable<OpenInterest[]> {
    let params: {
      category: string;
      symbol: string;
      intervalTime: string;
      limit: number;
      endTime?: number;
    } = {
      category: this.getCategory(exchange),
      symbol,
      intervalTime: period.includes('m') ? `${period}in` : period,
      limit,
    };
    if (endTime) {
      params = { ...params, endTime };
    }

    return this.http
      .get<BybitOpenInterest>(
        `${getExchangeOpenInterestAPI(exchange)}/open-interest`,
        {
          params,
        },
      )
      .pipe(map((data) => normalizeBybitOpenInterest(data)));
  }
}
