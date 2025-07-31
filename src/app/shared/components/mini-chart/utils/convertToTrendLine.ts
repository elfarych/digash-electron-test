import { ChartLevelData } from '../../../models/ChartHorizontalLevels';
import { roundDate } from '../../../utils/roundDate';
import { Time } from 'lightweight-charts';
import { CandlestickVisualization } from '../../../models/Candlestick';
import { Timeframe } from '../../../models/Timeframe';

export const convertToTrendLine = (
  level: ChartLevelData,
  endTime: Time,
  candlesData: CandlestickVisualization[],
  timeframe: Timeframe,
): [{ time: Time; price: number }, { time: Time; price: number }] => {
  const startTimeHigh = (roundDate(new Date(level.time), timeframe).getTime() /
    1000) as Time;
  const point1 = {
    time:
      endTime === startTimeHigh
        ? (candlesData[candlesData.length - 2].time as Time)
        : startTimeHigh,
    price: level.value,
  };
  const point2 = { time: endTime as Time, price: level.value };

  return [point1, point2];
};
