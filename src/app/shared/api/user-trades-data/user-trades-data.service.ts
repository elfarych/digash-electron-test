import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, firstValueFrom, map, Observable, of} from 'rxjs';
import {AuthService} from '../../../auth/data-access/auth.service';
import {Exchange} from '../../models/Exchange';
import {
  UserTradesData,
  UserTradesProcessedData,
} from './user-trades-data.models';
import {UserTradesDataResources} from './user-trades-data.resources';
import {environment} from "../../../../environments/environment";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";

interface UserTradesDataCache {
  [exchange: string]: {
    [symbol: string]: UserTradesProcessedData[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserTradesDataService {
  private tradesCache: UserTradesDataCache = {};
  private activeStreams: { [exchange: string]: WebSocketSubject<unknown> } = {};
  private userTrades$: BehaviorSubject<{
    [exchange: string]: {
      [symbol: string]: UserTradesProcessedData[];
    };
  }> = new BehaviorSubject({});

  constructor(
    private readonly resources: UserTradesDataResources,
    private readonly authService: AuthService,
  ) {
  }

  public subscribeToUserTrades(
    exchange: Exchange,
    symbol: string,
  ): Observable<UserTradesProcessedData[]> {
    return this.userTrades$.pipe(
      map((data) => data[exchange]?.[symbol] ?? []),
    );
  }

  public getTrades(
    symbol: string,
    exchange: Exchange,
    endTime: number,
  ): Observable<UserTradesProcessedData[]> {
    if (this.userTrades$.value[exchange]?.[symbol]) {
      return of(this.userTrades$.value[exchange][symbol]);
    }

    return this.resources.getTrades(symbol, exchange, endTime).pipe(
      map((data) => {
        if (!this.tradesCache[exchange]) {
          this.tradesCache[exchange] = {};
        }

        const updData = {
          ...this.userTrades$.value,
          [exchange]: {
            ...this.userTrades$.value[exchange],
            [symbol]: data,
          },
        };
        this.userTrades$.next(updData);

        return data;
      }),
      catchError((err) => of([]))
    );
  }

  public async setupStream(exchange: Exchange): Promise<void> {
    if (this.activeStreams[exchange]) {
      return void 0;
    }

    if (!this.tradesCache[exchange]) {
      this.tradesCache[exchange] = {};
    }

    const token = await firstValueFrom(this.authService.getAccessToken());
    if (!token) {
      return void 0;
    }

    const ws = webSocket<unknown>({
      url: `${environment.wsUserTradesProxyUrl}/updates`,
      openObserver: {
        next: () => {
          ws.next({event: 'auth', token, exchange})
        },
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket trades closed, reconnecting...');
          setTimeout(() => this.setupStream(exchange), 5000);
        },
      },
    });

    this.activeStreams[exchange] = ws;

    ws.subscribe((event: any) => {
      const {data}: { event: string; data?: UserTradesData } = event;

      if (!data) {
        return void 0;
      }

      const updData = {
        ...this.userTrades$.value,
        [exchange]: {
          ...this.userTrades$.value[exchange],
        },
      };

      if (!this.userTrades$.value[exchange][data.symbol]) {
        updData[exchange][data.symbol] = [this.createPositionFromTrade(data)];
      } else {
        updData[exchange][data.symbol] = this.addTradeToPositions(
          data,
          updData[exchange][data.symbol],
        );
      }

      this.userTrades$.next(updData);
    })
  }

  private addTradeToPositions(
    trade: UserTradesData,
    positions: UserTradesProcessedData[],
  ): UserTradesProcessedData[] {
    if (positions?.length && !positions[0].positionClosed) {
      positions[0].trades.push(trade);
      positions[0] = this.updatePositionData(positions[0]);
    }

    if (positions?.length && positions[0].positionClosed) {
      positions.unshift(this.createPositionFromTrade(trade));
    }

    return positions;
  }

  private createPositionFromTrade(
    trade: UserTradesData,
  ): UserTradesProcessedData {
    return {
      symbol: trade.symbol,
      openPrice: +trade.price,
      openTime: trade.time,
      pnl: 0,
      positionClosed: false,
      pricePrecision: trade?.price?.split('.')?.[1]?.length,
      trades: [trade],
    };
  }

  private updatePositionData(
    position: UserTradesProcessedData,
  ): UserTradesProcessedData {
    const closeTrades: UserTradesData[] = [];
    const openTrades: UserTradesData[] = [];
    let openQty = 0;
    let closeQty = 0;
    let totalPnl = 0;

    const firstTrade = position.trades[0];
    const lastTrade = position.trades[position.trades.length - 1];

    for (const trade of position.trades) {
      const pnl = +trade.realizedPnl;
      const qty = +trade.qty;

      if (pnl !== 0) {
        closeTrades.push(trade);
        totalPnl += pnl;
        closeQty += qty;
      } else {
        openTrades.push(trade);
        openQty += qty;
      }
    }

    const openPrice = this.calculateAveragePrice(openTrades);
    const closePrice = this.calculateAveragePrice(closeTrades);
    const pnlPercentage = openPrice
      ? (totalPnl / (openPrice * closeQty)) * 100
      : 0;

    return {
      symbol: position.symbol,
      pricePrecision: position.pricePrecision,
      openPrice,
      closePrice,
      pnl: pnlPercentage,
      positionClosed: openQty === closeQty,
      openTime: firstTrade.time,
      closeTime: lastTrade.time,
      openQty: openQty,
      closeQty: closeQty,
      trades: position.trades,
    };
  }

  private calculateAveragePrice = (trades: UserTradesData[]): number => {
    const totalCost = trades.reduce(
      (sum, trade) => sum + +trade.price * +trade.qty,
      0,
    );
    const totalQty = trades.reduce((sum, trade) => sum + +trade.qty, 0);
    return totalCost / totalQty;
  };
}
