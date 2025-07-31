import { OverlayData } from 'night-vision/dist/types';
import { ChartType } from '../../../models/ChartType';
import { getLinesDataFromCandles } from '../../../utils/getLinesDataFromCandles';

export const getChartDataByChartType = (
  chartType: ChartType,
  candlesData: number[][],
): OverlayData => {
  switch (chartType) {
    case 'candlestick':
      return candlesData;
    case 'line':
      return getLinesDataFromCandles(candlesData);
    case 'area':
      return getLinesDataFromCandles(candlesData);
  }

  return candlesData;
};
