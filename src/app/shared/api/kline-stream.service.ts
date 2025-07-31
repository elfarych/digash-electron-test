import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Exchange } from '../models/Exchange';
import { Timeframe } from '../models/Timeframe';
import { CandlestickVisualization } from '../models/Candlestick';
import { BybitKlineStreamData } from '../models/BybitKlineStreamData';
import { BinanceKlineStreamData } from '../models/BinanceKlineStreamData';
import { getExchangeWS } from '../models/getExchangeAPI';
import {
  GateFuturesCandlesSocketData,
  GateSpotCandlesSocketData,
} from '../utils/gateKlineStreamData';
import { OkxKlineStreamData } from '../utils/OkxKlineStreamData';
import { timeToLocal } from '../utils/timeToLocal';
import { bybitIntervalConverter } from '../utils/bybitIntervalConverter';
import { BitgetKlineStreamData } from '../models/BitgetKlineStreamData';
import { bitgetCandleStremIntervalsMap } from '../utils/bitgetIntervalConverter';
import { okxIntervalConverter } from '../utils/okxIntervalConverter';
import { environment } from '../../../environments/environment';
import { MexcApiResources } from './mexc/mexc-api.resources';

@Injectable({
  providedIn: 'root',
})
export class KlineStreamService {
  private lastBitgetCandleTimestamp: string = '';
  private lastSConnectedSocket:
    | WebSocketSubject<CandlestickVisualization>
    | undefined;
  private bitgetPingInterval: number = 0;
  private lastGateCandleTimestamp: number;
  private gatePingInterval: number | null = null;

  constructor(private mexcResources: MexcApiResources) {}

  public getWebsocketStream(
    exchange: Exchange,
    symbol: string,
    interval: Timeframe,
  ): WebSocketSubject<CandlestickVisualization> {
    if (exchange.includes('MEXC')) {
      return this.mexcResources.setupWebsocket(exchange, symbol, interval);
    }

    const socket = webSocket({
      url: this.getWebsocketUrl(exchange, symbol, interval),
      deserializer: (value) => this.deserializer(value, exchange),
      closeObserver: {
        next: () => {
          console.log('WebSocket closed, reconnecting...');
          setTimeout(
            () => this.getWebsocketStream(exchange, symbol, interval),
            5000,
          );
        },
      },
    });

    if (exchange.includes('BYBIT')) {
      socket.next({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        op: 'subscribe',
        args: [`kline.${bybitIntervalConverter(interval)}.${symbol}`],
      });
    }

    if (this.bitgetPingInterval) clearInterval(this.bitgetPingInterval);

    if (exchange.includes('BITGET')) {
      const args = [
        {
          instType: exchange.includes('SPOT') ? 'SPOT' : 'USDT-FUTURES',
          channel: `candle${bitgetCandleStremIntervalsMap[interval]}`,
          instId: symbol,
        },
      ];

      socket.next({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        op: 'subscribe',
        args,
      });
    }

    if (exchange.includes('OKX')) {
      socket.next({
        // @ts-ignore
        op: 'subscribe',
        args: [
          {
            channel: `candle${okxIntervalConverter(interval)}`,
            instId: symbol,
          },
        ],
      });
    }

    if (exchange.includes('GATE')) {
      const market = exchange.includes('SPOT') ? 'spot' : 'futures';
      socket.next({
        time: Date.now(),
        // @ts-ignore
        event: 'subscribe',
        channel: `${market}.candlesticks`,
        payload: [interval, symbol],
      });

      this.gatePingInterval = setInterval(() => {
        socket.next({
          time: Date.now(),
          // @ts-ignore
          channel: `${market}.ping`,
        });
      }, 20_000);
    }

    return socket;
  }

  public unsubscribe(
    websocket: WebSocketSubject<unknown>,
    exchange: Exchange,
    symbol: string,
    interval: Timeframe,
  ): void {
    if (exchange.includes('BYBIT')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      websocket?.next({
        op: 'unsubscribe',
        args: [`kline.${bybitIntervalConverter(interval)}.${symbol}`],
      });
    }

    if (exchange.includes('BITGET')) {
      websocket.next({
        op: 'unsubscribe',
        args: [
          {
            instType: exchange.includes('SPOT') ? 'SPOT' : 'USDT-FUTURES',
            channel: `candle${bitgetCandleStremIntervalsMap[interval]}`,
            instId: symbol,
          },
        ],
      });
    }
  }

  private deserializer(
    value: MessageEvent,
    exchange: Exchange,
  ): CandlestickVisualization {
    switch (exchange) {
      case 'BINANCE_SPOT':
      case 'BINANCE_FUTURES':
      case 'BINANCE_SPOT_WITH_FUTURES':
      case 'BINANCE_SPOT_WITHOUT_FUTURES':
        return this.binanceKlineDeserializer(JSON.parse(value.data));
      case 'BYBIT_SPOT':
      case 'BYBIT_FUTURES':
        return this.bybitKlineDeserializer(JSON.parse(value.data));

      case 'BITGET_SPOT':
      case 'BITGET_FUTURES':
      case 'BITGET_SPOT_WITHOUT_BINANCE':
      case 'BITGET_FUTURES_WITHOUT_BINANCE':
        return this.bitgetKlineDeserializer(JSON.parse(value.data));

      case 'OKX_SPOT':
      case 'OKX_FUTURES':
        return this.okxKlineDeserializer(JSON.parse(value.data), exchange);

      case 'GATE_SPOT':
        return this.gateSpotKlineDeserializer(JSON.parse(value.data));
      case 'GATE_FUTURES':
        return this.gateFuturesKlineDeserializer(JSON.parse(value.data));
    }

    return JSON.parse(value.data) as CandlestickVisualization;
  }

  private bybitKlineDeserializer(
    data: BybitKlineStreamData,
  ): CandlestickVisualization {
    if (!data.data) {
      return void 0;
    }

    const candleData = data.data[0];

    const parts = data.topic.split('.');
    const symbol = parts[parts.length - 1];
    return {
      time: candleData.confirm
        ? Math.round(candleData.end / 1000)
        : Math.round(candleData.start / 1000),
      open: parseFloat(candleData.open),
      high: parseFloat(candleData.high),
      low: parseFloat(candleData.low),
      close: parseFloat(candleData.close),
      volume: parseFloat(candleData.volume),
      newCandle: candleData.confirm,
      buyVolume: 0,
      sellVolume: 0,
      symbol,
    };
  }

  private binanceKlineDeserializer(
    data: BinanceKlineStreamData,
  ): CandlestickVisualization {
    return {
      time: data.k.x
        ? timeToLocal(Math.round(data.k.T / 1000))
        : timeToLocal(Math.round(data.k.t / 1000)),
      open: parseFloat(data.k.o),
      high: parseFloat(data.k.h),
      low: parseFloat(data.k.l),
      close: parseFloat(data.k.c),
      volume: parseFloat(data.k.v),
      buyVolume: parseFloat(data.k.V),
      sellVolume: parseFloat(data.k.v) - parseFloat(data.k.V),
      newCandle: data.k.x,
      symbol: data.s,
    };
  }

  private bitgetKlineDeserializer(
    data: BitgetKlineStreamData,
  ): CandlestickVisualization {
    if (!data.data || data.action === 'snapshot') {
      return void 0;
    }

    const candleData = data.data?.[0];

    if (!this.lastBitgetCandleTimestamp) {
      this.lastBitgetCandleTimestamp = candleData[0];
    }

    const newCandle = this.lastBitgetCandleTimestamp !== candleData[0];

    this.lastBitgetCandleTimestamp = candleData[0];

    return {
      time: Math.round(parseInt(candleData[0]) / 1000),
      open: parseFloat(candleData[1]),
      high: parseFloat(candleData[2]),
      low: parseFloat(candleData[3]),
      close: parseFloat(candleData[4]),
      volume: parseFloat(candleData[5]),
      newCandle,
      buyVolume: 0,
      sellVolume: 0,
      symbol: data.arg.instId,
    };
  }

  private okxKlineDeserializer(
    data: OkxKlineStreamData,
    exchange: Exchange,
  ): CandlestickVisualization {
    if (!data.data) return void 0;
    const [start, open, high, low, close, vol, volCcy, volCcyQuote, confirm] =
      data.data[0];

    let volume = 0;

    if (exchange === 'OKX_SPOT') volume = parseFloat(vol) * parseFloat(close);
    if (exchange === 'OKX_FUTURES')
      volume = parseFloat(vol) * parseFloat(close);

    return {
      time: Math.round(parseInt(start) / 1000),
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume,
      buyVolume: 0,
      sellVolume: 0,
      newCandle: !!parseInt(confirm),
      symbol: data.arg.instId,
    };
  }

  private gateSpotKlineDeserializer(
    data: GateSpotCandlesSocketData,
  ): CandlestickVisualization {
    if (!data.result || data.event !== 'update') return void 0;
    const result = data.result;

    const extractSymbol = (input) => {
      const underscoreIndex = input.indexOf('_');
      return input.substring(underscoreIndex + 1);
    };

    return {
      time: parseInt(result.t),
      open: parseFloat(result.o),
      high: parseFloat(result.h),
      low: parseFloat(result.l),
      close: parseFloat(result.c),
      volume: parseFloat(result.a),
      buyVolume: 0,
      sellVolume: 0,
      newCandle: result.w,
      symbol: extractSymbol(result.n),
    };
  }

  private gateFuturesKlineDeserializer(
    data: GateFuturesCandlesSocketData,
  ): CandlestickVisualization {
    if (!data.result || data.event !== 'update') return void 0;
    const result = data.result[0];

    return {
      time: parseInt(result.t),
      open: parseFloat(result.o),
      high: parseFloat(result.h),
      low: parseFloat(result.l),
      close: parseFloat(result.c),
      volume: parseFloat(result.v),
      buyVolume: 0,
      sellVolume: 0,
      newCandle: data.result.length > 1,
    };
  }

  private getWebsocketUrl(
    exchange: Exchange,
    symbol: string,
    interval: Timeframe,
  ): string {
    switch (exchange) {
      case 'BINANCE_SPOT':
      case 'BINANCE_FUTURES':
      case 'BINANCE_SPOT_WITH_FUTURES':
      case 'BINANCE_SPOT_WITHOUT_FUTURES':
        return `${getExchangeWS(exchange)}/${symbol.toLowerCase()}@kline_${interval}`;
      case 'BYBIT_SPOT':
      case 'BYBIT_FUTURES':
        return `${getExchangeWS(exchange)}`;
      case 'BITGET_SPOT':
      case 'BITGET_FUTURES':
      case 'BITGET_SPOT_WITHOUT_BINANCE':
      case 'BITGET_FUTURES_WITHOUT_BINANCE':
        return 'wss://ws.bitget.com/v2/ws/public';
      case 'OKX_FUTURES':
      case 'OKX_SPOT':
        return `${getExchangeWS(exchange)}`;
      case 'GATE_SPOT':
        return 'wss://api.gateio.ws/ws/v4/';
      case 'GATE_FUTURES':
        return 'wss://fx-ws.gateio.ws/v4/ws/usdt';
      case 'MEXC_SPOT':
      case 'MEXC_FUTURES':
        return `${environment.proxyUrl}/mexc/klines/`;
    }

    return '';
  }
}
