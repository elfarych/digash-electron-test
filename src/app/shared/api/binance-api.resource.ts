import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import {
  normalizeBinanceKlinesToCandlestick,
  normalizeCommonKlinesToCandlestick,
} from '../utils/normalizeKlinesToCandlestick';
import { Exchange } from '../models/Exchange';
import { ExchangeCommonApiResources } from './exchange-common-api.resources';
import {
  CandlestickBinance,
  CandlestickCommon,
  CandlestickVisualization,
} from '../models/Candlestick';
import { getExchangeAPI } from '../models/getExchangeAPI';
import { exchangeMapper } from '../utils/exchangeMapper';
import { environment } from '../../../environments/environment';
import { roundDate } from '../utils/roundDate';
import { Timeframe } from '../models/Timeframe';
import { OpenInterest } from '../models/OpenInterest';
import { BinanceOpenInterest } from '../models/BinanceOpenInterest';
import { normalizeBincanceOpenInterest } from '../utils/normalizeOpenInterest';
import { ApiGatewayService } from '../../core/http/api-gateway.service';

@Injectable({
  providedIn: 'root',
})
export class BinanceApiResource extends ExchangeCommonApiResources {
  constructor(
    private http: HttpClient,
    private apiGatewayService: ApiGatewayService,
  ) {
    super();
  }

  public getKlines(
    symbol: string,
    exchange: Exchange,
    interval = '1m',
    limit = 1000,
  ): Observable<CandlestickVisualization[]> {
    return this.getOriginalKlinesData(symbol, exchange, interval, limit).pipe(
      map((data: CandlestickBinance[]) =>
        normalizeCommonKlinesToCandlestick(data),
      ),
    );
  }

  public getKlinesMore(
    symbol: string,
    exchange: Exchange,
    interval = '1m',
    limit = 200,
    endTime: number,
  ): Observable<CandlestickVisualization[]> {
    return this.http
      .get<CandlestickBinance[]>(`${getExchangeAPI(exchange)}/klines`, {
        params: {
          symbol,
          interval,
          limit,
          endTime,
        },
      })
      .pipe(
        map((data: CandlestickBinance[]) =>
          normalizeBinanceKlinesToCandlestick(data),
        ),
      );
  }

  private getOriginalKlinesData(
    symbol: string,
    exchange: Exchange,
    interval = '1m',
    limit = 1000,
  ): Observable<CandlestickCommon[]> {
    let proxyUrl: string;
    let fallbackUrl: string;
    let params: HttpParams;

    // if (this.apiGatewayService.getProxyIsUsed()) {
    if (true) {
      proxyUrl = `${getExchangeAPI(exchange)}/klines`;
      fallbackUrl = `${getExchangeAPI(exchange)}/klines`;
      params = new HttpParams()
        .set('symbol', symbol)
        .set('interval', interval)
        .set('limit', limit.toString());
    } else {
      proxyUrl = `${environment.proxyUrl}/klines`;
      fallbackUrl = `${getExchangeAPI(exchange)}/klines`;
      params = new HttpParams()
        .set('symbol', symbol)
        .set('interval', interval)
        .set('limit', limit.toString())
        .set('exchange', exchangeMapper(exchange));
    }

    return this.http.get<CandlestickCommon[]>(proxyUrl, { params }).pipe(
      map((data) => {
        if (
          data.length === 0 ||
          data[data.length - 1][0] !==
            roundDate(new Date(), interval as Timeframe).getTime()
        ) {
          throw new Error('Invalid candlestick data');
        }
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching data from proxy:', error);

        const fallbackParams = new HttpParams()
          .set('symbol', symbol)
          .set('interval', interval)
          .set('limit', limit.toString());

        return this.http.get<CandlestickCommon[]>(fallbackUrl, {
          params: fallbackParams,
        });
      }),
    );
  }

  public getOpenInterestData(
    symbol: string,
    exchange: Exchange,
    period: string = '5m',
    limit: number = 200,
    endTime?: number,
  ): Observable<OpenInterest[]> {
    let params: {
      symbol: string;
      period: string;
      limit: number;
      endTime?: number;
    } = { symbol, period, limit };
    if (endTime) {
      params = { ...params, endTime };
    }

    return this.http
      .get<BinanceOpenInterest[]>(
        `https://fapi.binance.com/futures/data/openInterestHist`,
        {
          params,
        },
      )
      .pipe(map((data) => normalizeBincanceOpenInterest(data)));
  }
}
