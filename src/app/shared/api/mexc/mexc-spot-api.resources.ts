import { Injectable } from '@angular/core';
import { Exchange } from '../../models/Exchange';
import {
  CandlestickIntervals,
  CandlestickVisualization,
} from '../../models/Candlestick';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MexcSpotApiKline, MexcWebsocketKline } from './mexc-api.types';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Timeframe } from '../../models/Timeframe';

@Injectable({
  providedIn: 'root',
})
export class MexcSpotApiResources {
  private lastCandleTime: number = 0;
  private firstSocketData: boolean = true;

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
      .get<MexcSpotApiKline[]>(proxyUrl, {
        params: {
          symbol,
          interval,
          limit,
          endTime,
          exchange,
        },
      })
      .pipe(map((data) => this.normalizeKlinesToCandlestick(data)));
  }

  public setupWebsocket(
    exchange: Exchange,
    symbol: string,
    interval: CandlestickIntervals,
  ): WebSocketSubject<CandlestickVisualization> {
    const websocket = webSocket({
      url: `${environment.wsProxyUrl}/mexc/klines/`,
      deserializer: (value) =>
        this.deserializer(value as unknown as { data: MexcWebsocketKline }),
    });
    // @ts-ignore
    websocket.next({ exchange, symbol, interval });
    this.firstSocketData = true;
    return websocket;
  }

  private deserializer(value: {
    data: MexcWebsocketKline;
  }): CandlestickVisualization {
    // @ts-ignore
    const kline = JSON.parse(value.data);
    const newCandle = this.firstSocketData
      ? false
      : +kline.windowStart > this.lastCandleTime;
    this.firstSocketData = false;
    this.lastCandleTime = +kline.windowStart;
    return {
      open: +kline.openingPrice,
      high: +kline.highestPrice,
      low: +kline.lowestPrice,
      close: +kline.closingPrice,
      volume: +kline.volume * +kline.closingPrice,
      sellVolume: 0,
      buyVolume: 0,
      time: +kline.windowStart,
      newCandle,
    };
  }

  private normalizeKlinesToCandlestick(
    data: MexcSpotApiKline[],
  ): CandlestickVisualization[] {
    return data.map((d) => {
      return {
        time: d[0] / 1000,
        open: +d[1],
        high: +d[2],
        low: +d[3],
        close: +d[4],
        volume: +d[5] * +d[4],
        newCandle: true,
        buyVolume: 0,
        sellVolume: 0,
      };
    });
  }
}
