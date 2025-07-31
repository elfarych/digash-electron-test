import { IChartApi, ISeriesApi, SeriesOptionsMap } from 'lightweight-charts';

export interface OrderbookLinesOptions {
  /** Interval between bars (in seconds) */
  interval: number;
  /** Delay when removing an alert */
  clearTimeout: number;
}

export const defaultOptions: OrderbookLinesOptions = {
  interval: 60 * 60 * 24,
  clearTimeout: 3000,
};

export interface OrderbookLinesParameters {
  color: string;
  title: string;
  crossingDirection: 'up' | 'down';
}

export interface OrderbookLinesModel {
  price: number;
  start: number;
  end: number;
  parameters: OrderbookLinesParameters;
  crossed: boolean;
  expired: boolean;
}

export interface IOrderbookLines {
  alerts(): Map<string, OrderbookLinesModel>;
  chart(): IChartApi | null;
  series(): ISeriesApi<keyof SeriesOptionsMap>;
}
