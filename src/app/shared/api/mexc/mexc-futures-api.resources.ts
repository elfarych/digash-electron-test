import { Injectable } from '@angular/core';
import { Exchange } from '../../models/Exchange';
import {
  CandlestickIntervals,
  CandlestickVisualization,
} from '../../models/Candlestick';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  MexcFuturesContractInfo,
  MexcFuturesKlineApiData,
  MexcFuturesKlineWebsocketData,
} from './mexc-api.types';
import { environment } from '../../../../environments/environment';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Timeframe } from '../../models/Timeframe';

@Injectable({
  providedIn: 'root',
})
export class MexcFuturesApiResources {
  private lastCandleTime: number = 0;
  private firstSocketData: boolean = true;
  private contracts: { [symbol: string]: MexcFuturesContractInfo } = {};

  constructor(private http: HttpClient) {}

  public getKlines(
    symbol: string,
    exchange: Exchange,
    interval: Timeframe,
    limit: number,
    endTime: number = 0,
  ): Observable<CandlestickVisualization[]> {
    const proxyUrl = `${environment.proxyUrl}/klines`;
    return this.http
      .get<{
        klines: MexcFuturesKlineApiData;
        contract: MexcFuturesContractInfo;
      }>(proxyUrl, {
        params: {
          symbol,
          interval,
          limit,
          endTime,
          exchange,
        },
      })
      .pipe(map((data) => this.normalizeKlinesToCandlestick(data, symbol)));
  }

  public setupWebsocket(
    exchange: Exchange,
    symbol: string,
    interval: CandlestickIntervals,
  ): WebSocketSubject<CandlestickVisualization> {
    const websocket = webSocket({
      url: `${environment.wsProxyUrl}/mexc/klines/`,
      deserializer: (value) =>
        this.deserializer(
          value as unknown as { data: MexcFuturesKlineWebsocketData },
          symbol,
        ),
    });
    // @ts-ignore
    websocket.next({ exchange, symbol, interval });
    this.firstSocketData = true;
    return websocket;
  }

  private deserializer(
    value: { data: MexcFuturesKlineWebsocketData },
    symbol: string,
  ): CandlestickVisualization {
    // @ts-ignore
    const kline = JSON.parse(value.data);
    const newCandle = this.firstSocketData
      ? false
      : +kline.t > this.lastCandleTime;
    this.firstSocketData = false;
    this.lastCandleTime = +kline.t;
    return {
      open: +kline.o,
      high: +kline.h,
      low: +kline.l,
      close: +kline.c,
      volume: +kline.q * +kline.c * (this.contracts[symbol]?.contractSize ?? 1),
      sellVolume: 0,
      buyVolume: 0,
      time: +kline.t,
      newCandle,
    };
  }

  private normalizeKlinesToCandlestick(
    data: {
      klines: MexcFuturesKlineApiData;
      contract: MexcFuturesContractInfo;
    },
    symbol: string,
  ): CandlestickVisualization[] {
    if (!data?.klines?.time?.length) {
      return [];
    }

    this.contracts[symbol] = data.contract;

    const result: CandlestickVisualization[] = [];
    for (const index in data.klines.time) {
      const candlestick: CandlestickVisualization = {
        time: data.klines.time[index],
        open: data.klines.open[index],
        high: data.klines.high[index],
        low: data.klines.low[index],
        close: data.klines.close[index],
        volume:
          data.klines.vol[index] *
          (this.contracts[symbol]?.contractSize ?? 1) *
          data.klines.close[index],
        newCandle: true,
        buyVolume: 0,
        sellVolume: 0,
      };
      result.push(candlestick);
    }
    return result;
  }
}
