import { DrawingTool } from '../../../models/DrawingTool';
import { Timeframe } from '../../../models/Timeframe';
import { Exchange } from '../../../models/Exchange';

export interface ChartDrawingToolsData {
  data: DrawingTool[];
  timeframe: Timeframe;
  symbol: string;
  exchange: Exchange;
}

export interface ChartRangeUpdateData {
  candlesLength: number;
  timeframe: Timeframe;
  range: [number, number];
  initiatorSymbol: string;
}
