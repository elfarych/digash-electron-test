import { ChartType } from '../../../models/ChartType';

export const getPaneType = (chartType: ChartType) => {
  switch (chartType) {
    case 'candlestick':
      return 'Candles';
    case 'area':
      return 'Area';
    case 'line':
      return 'Spline';
  }

  return 'Candles';
};
