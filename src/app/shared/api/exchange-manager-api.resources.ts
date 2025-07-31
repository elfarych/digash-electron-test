import { Injectable } from '@angular/core';
import { BybitApiResources } from './bybit-api.resources';
import { BinanceApiResource } from './binance-api.resource';
import { Exchange } from '../models/Exchange';
import {
  CandlestickIntervals,
  CandlestickVisualization,
} from '../models/Candlestick';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Timeframe } from '../models/Timeframe';
import { BitgetApiResources } from './bitget-api.resources';
import { OpenInterest } from '../models/OpenInterest';
import { GateApiResources } from './gate-api.resources';
import { OkxApiResources } from './okx-api.resources';
import { MexcApiResources } from './mexc/mexc-api.resources';
import { Liquidation } from '../utils/Liquidation';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExchangeManagerApiResources {
  constructor(
    private bybitResources: BybitApiResources,
    private binanceResources: BinanceApiResource,
    private bitgetResource: BitgetApiResources,
    private okxResources: OkxApiResources,
    private gateResources: GateApiResources,
    private mexcResources: MexcApiResources,
    private http: HttpClient,
  ) {}

  public getKlines(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe,
    limit: number,
  ): Observable<CandlestickVisualization[]> {
    switch (exchange) {
      case 'BYBIT_SPOT':
      case 'BYBIT_FUTURES':
        return this.bybitResources.getKlines(symbol, exchange, interval, limit);
      case 'BINANCE_FUTURES':
      case 'BINANCE_SPOT':
      case 'BINANCE_SPOT_WITHOUT_FUTURES':
      case 'BINANCE_SPOT_WITH_FUTURES':
        return this.binanceResources.getKlines(
          symbol,
          exchange,
          interval,
          limit,
        );
      case 'BITGET_SPOT':
      case 'BITGET_FUTURES':
      case 'BITGET_SPOT_WITHOUT_BINANCE':
      case 'BITGET_FUTURES_WITHOUT_BINANCE':
        return this.bitgetResource.getKlines(symbol, exchange, interval, limit);
      case 'OKX_SPOT':
      case 'OKX_FUTURES':
        return this.okxResources.getKlines(symbol, exchange, interval, limit);
      case 'GATE_SPOT':
      case 'GATE_FUTURES':
        return this.gateResources.getKlines(symbol, exchange, interval, limit);
      case 'MEXC_SPOT':
      case 'MEXC_FUTURES':
        return this.mexcResources.getKlines(symbol, exchange, interval, limit);
    }

    return of([]);
  }

  public getKlinesMore(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe = '1m',
    limit = 400,
    endTime: number,
  ): Observable<CandlestickVisualization[]> {
    switch (exchange) {
      case 'BYBIT_SPOT':
      case 'BYBIT_FUTURES':
        return this.bybitResources.getKlinesMore(
          symbol,
          exchange,
          interval,
          limit,
          endTime,
        );
      case 'BINANCE_FUTURES':
      case 'BINANCE_SPOT':
      case 'BINANCE_SPOT_WITHOUT_FUTURES':
      case 'BINANCE_SPOT_WITH_FUTURES':
        return this.binanceResources.getKlinesMore(
          symbol,
          exchange,
          interval,
          limit,
          endTime,
        );
      case 'BITGET_SPOT':
      case 'BITGET_FUTURES':
      case 'BITGET_SPOT_WITHOUT_BINANCE':
      case 'BITGET_FUTURES_WITHOUT_BINANCE':
        return this.bitgetResource.getKlinesMore(
          symbol,
          exchange,
          interval,
          limit,
          endTime,
        );
      case 'OKX_FUTURES':
      case 'OKX_SPOT':
        return this.okxResources.getKlinesMore(
          symbol,
          exchange,
          interval,
          limit,
          endTime,
        );
      case 'GATE_SPOT':
      case 'GATE_FUTURES':
        return this.gateResources.getKlinesMore(
          symbol,
          exchange,
          interval,
          limit,
          endTime,
        );
      case 'MEXC_FUTURES':
      case 'MEXC_SPOT':
        return this.mexcResources.getKlinesMore(
          symbol,
          exchange,
          interval,
          limit,
          endTime,
        );
    }

    return of([]);
  }

  public async getLiquidationsData(
    symbol: string,
    exchange: Exchange | Exchange[],
    interval: CandlestickIntervals = '5m',
    start: number = 0,
    end: number = 500,
  ): Promise<{ [tick: string]: Liquidation }> {
    if (exchange !== 'BINANCE_FUTURES' && exchange !== 'BYBIT_FUTURES') {
      return Promise.resolve({});
    }

    return await firstValueFrom(
      this.http.get<{ [tick: string]: Liquidation }>(
        `${environment.baseUrl}/liquidations/${exchange}/${symbol}/${interval}/${start}-${end}`,
      ),
    );
  }

  public getOpenInterestData(
    symbol: string,
    exchange: Exchange,
    period: string = '5m',
    limit: number = 200,
    endTime?: number,
  ): Observable<OpenInterest[]> {
    switch (exchange) {
      case 'BINANCE_FUTURES':
        return this.binanceResources.getOpenInterestData(
          symbol,
          exchange,
          period,
          limit,
          endTime,
        );
      case 'BYBIT_FUTURES':
        return this.bybitResources.getOpenInterestData(
          symbol,
          exchange,
          period as Timeframe,
          limit,
          endTime,
        );
      default:
        return of([]);
    }
  }
}
