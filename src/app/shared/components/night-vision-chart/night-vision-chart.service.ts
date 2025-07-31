import { Injectable } from '@angular/core';
import {
  filter,
  firstValueFrom,
  Observable,
  retry,
  take,
  takeUntil,
} from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WorkspaceResources } from '../../../pages/charts-screener/data-access/workspace.resources';
import { DrawingToolsApiResources } from '../../api/drawing-tools-api.resources';
import { ExchangeManagerApiResources } from '../../api/exchange-manager-api.resources';
import { KlineStreamService } from '../../api/kline-stream.service';
import { UserTradesProcessedData } from '../../api/user-trades-data/user-trades-data.models';
import { UserTradesDataService } from '../../api/user-trades-data/user-trades-data.service';
import { Alert } from '../../models/Alert';
import {
  CandlestickIntervals,
  CandlestickVisualization,
} from '../../models/Candlestick';
import { ChartTechnicalIndicators } from '../../models/chart-indicators/ChartIndicators';
import { ChartIndicatorsProps } from '../../models/chart-indicators/ChartIndicatorsProps';
import { DrawingTool } from '../../models/DrawingTool';
import { Exchange } from '../../models/Exchange';
import { OpenInterest } from '../../models/OpenInterest';
import { AlertsService } from '../../store/alerts/alerts.service';
import { getTechnicalIndicatorDefaultProps } from '../../utils/getTechnicalIndicatorDefaultProps';
import { resolveCoinName } from '../../utils/resolveCoinName';
import { ChartIndicatorSettingsService } from './components/chart-indicator-settings/chart-indicator-settings.service';
import { Liquidation } from '../../utils/Liquidation';

@Injectable({
  providedIn: 'root',
})
export class NightVisionChartService {
  private websocketCandlesticks: Map<string, WebSocketSubject<any>> = new Map();
  private candleStickStreamUpdates: Map<
    string,
    Subject<CandlestickVisualization>
  > = new Map();
  private selectedChartCurrentPriceUpdate: Subject<number> =
    new Subject<number>();
  private destroyed$: Map<string, Subject<void>> = new Map();

  constructor(
    private klineStreamService: KlineStreamService,
    private exchangeManagerApiResources: ExchangeManagerApiResources,
    private drawingToolsResources: DrawingToolsApiResources,
    private alertsService: AlertsService,
    private resources: WorkspaceResources,
    private chartIndicatorSettingsService: ChartIndicatorSettingsService,
    private userTradesDataService: UserTradesDataService,
  ) {}

  public async getUserTrades(
    symbol: string,
    exchange: Exchange,
    endTime?: number,
  ): Promise<UserTradesProcessedData[]> {
    return await firstValueFrom(
      this.userTradesDataService.getTrades(
        symbol,
        exchange,
        endTime ?? Date.now(),
      ),
    );
  }

  public async getLiquidationsData(
    symbol: string,
    exchange: Exchange | Exchange[],
    interval: CandlestickIntervals = '5m',
    start: number = 0,
    end: number = 500,
  ): Promise<{ [tick: string]: Liquidation }> {
    return this.exchangeManagerApiResources.getLiquidationsData(
      symbol,
      exchange,
      interval,
      start,
      end,
    );
  }

  public setupUserTradesStream(exchange: Exchange): void {
    this.userTradesDataService.setupStream(exchange);
  }

  public loadDrawingTools(): void {
    this.drawingToolsResources.loadAllDrawingTools().pipe(take(1)).subscribe();
  }

  public subscribeToUserTrades(
    exchange: Exchange,
    symbol: string,
  ): Observable<UserTradesProcessedData[]> {
    return this.userTradesDataService.subscribeToUserTrades(exchange, symbol);
  }

  public async getDrawingTools(symbol: string): Promise<DrawingTool[]> {
    return await firstValueFrom(
      this.drawingToolsResources.getDrawingTools(symbol),
    );
  }

  public getOpenInterestData(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals = '5m',
    endTime: number,
    limit: number = 200,
  ): Promise<OpenInterest[]> {
    return firstValueFrom(
      this.exchangeManagerApiResources.getOpenInterestData(
        symbol,
        exchange,
        interval,
        limit,
        endTime,
      ),
    );
  }

  public async saveDrawingTools(data: {
    symbol: string;
    data: DrawingTool[];
  }): Promise<void> {
    await firstValueFrom(this.drawingToolsResources.saveDrawingTools(data));
  }

  public openChartIndicatorSettings(
    chartIndicator: ChartTechnicalIndicators,
    premium: boolean,
  ): Promise<ChartIndicatorsProps> {
    if (!chartIndicator) {
      return void 0;
    }

    if (!chartIndicator.props) {
      chartIndicator.props = getTechnicalIndicatorDefaultProps(chartIndicator);
    }

    return this.chartIndicatorSettingsService.open(chartIndicator, premium);
  }

  public async getKlinesData(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals = '5m',
  ): Promise<CandlestickVisualization[]> {
    // symbol = await this.tryToResolveSymbol(exchange, symbol);
    return await firstValueFrom(
      this.exchangeManagerApiResources.getKlines(
        symbol,
        exchange,
        interval,
        1000,
      ),
    );
  }

  public async getMoreKlinesData(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals = '5m',
    endTime: number,
  ): Promise<CandlestickVisualization[]> {
    // symbol = await this.tryToResolveSymbol(exchange, symbol);
    return await firstValueFrom(
      this.exchangeManagerApiResources.getKlinesMore(
        symbol,
        exchange,
        interval,
        500,
        endTime,
      ),
    );
  }

  public updateSelectedChartCurrentPrice(
    data: CandlestickVisualization,
    key: string,
  ): void {
    const streamUpdate = this.candleStickStreamUpdates.get(key);
    if (streamUpdate) {
      streamUpdate.next(data);
    }
  }

  public setSelectedChartCurrentPriceUpdate(price: number): void {
    this.selectedChartCurrentPriceUpdate.next(price);
  }

  public setupCandlestickDataStreaming(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals,
    customId: string = '',
  ): void {
    const key = this.getStreamKey(symbol, exchange, interval, customId);
    this.destroyCandlestickStreaming(key);

    const websocketCandlestick = this.klineStreamService.getWebsocketStream(
      exchange,
      symbol,
      interval,
    );
    const destroyed$ = new Subject<void>();
    const streamUpdate = new Subject<CandlestickVisualization>();

    this.websocketCandlesticks.set(key, websocketCandlestick);
    this.destroyed$.set(key, destroyed$);
    this.candleStickStreamUpdates.set(key, streamUpdate);

    websocketCandlestick
      .pipe(
        filter(Boolean),
        takeUntil(destroyed$),
        retry({ delay: 10000, count: 10 }),
      )
      .subscribe((data: CandlestickVisualization) =>
        this.updateSelectedChartCurrentPrice(data, key),
      );
  }

  public getCandlestickDataStreamUpdate(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals,
    customId: string = '',
  ): Subject<CandlestickVisualization> | undefined {
    const key = this.getStreamKey(symbol, exchange, interval, customId);
    return this.candleStickStreamUpdates.get(key);
  }

  public destroyCandlestickStreaming(key: string): void {
    const websocketCandlestick = this.websocketCandlesticks.get(key);
    const destroyed$ = this.destroyed$.get(key);
    const streamUpdate = this.candleStickStreamUpdates.get(key);

    if (websocketCandlestick) {
      websocketCandlestick.complete();
      websocketCandlestick.unsubscribe();
    }

    if (destroyed$) {
      destroyed$.next();
      destroyed$.complete();
    }

    if (streamUpdate) {
      streamUpdate.complete();
    }

    this.websocketCandlesticks.delete(key);
    this.destroyed$.delete(key);
    this.candleStickStreamUpdates.delete(key);
  }

  public destroy(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals,
    customId: string = '',
  ): void {
    const key = this.getStreamKey(symbol, exchange, interval, customId);
    this.destroyCandlestickStreaming(key);
  }

  public destroyAll(): void {
    for (const key of this.candleStickStreamUpdates.keys()) {
      this.destroyCandlestickStreaming(key);
    }
  }

  public createFastSignalLevelAlert(
    value: number,
    symbol: string,
    market: Exchange,
  ): void {
    this.alertsService.createFastSignalLevelAlert(value, symbol, market);
  }

  public getPriceCrossingAlertsBySymbol(
    symbol: string,
    exchange: Exchange,
  ): Observable<Alert[]> {
    return this.alertsService.getPriceCrossingAlertsBySymbol(symbol, exchange);
  }

  private getStreamKey(
    symbol: string,
    exchange: Exchange,
    interval: CandlestickIntervals,
    customId: string = '',
  ): string {
    return `${symbol}-${exchange}-${interval}-${customId}`;
  }

  private async tryToResolveSymbol(
    exchange: Exchange,
    symbol: string,
  ): Promise<string> {
    const coins: string[] = await firstValueFrom(
      this.resources.loadExchangeCoins(exchange),
    );
    let resolved_symbol = symbol;
    if (!coins.includes(resolved_symbol)) {
      resolved_symbol = resolveCoinName(exchange, symbol);
    }
    if (!coins.includes(resolved_symbol)) {
      return symbol;
    }
    return resolved_symbol;
  }
}
