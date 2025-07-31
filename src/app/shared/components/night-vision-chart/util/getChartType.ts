import { ChartType } from '../../../models/ChartType';

export const getChartType = (chartType: ChartType): string => {
  switch (chartType) {
    case 'candlestick':
      return 'CandlesCustom';
    case 'bars':
      return 'BarsOHLC';
  }

  return 'CandlesCustom';
};
