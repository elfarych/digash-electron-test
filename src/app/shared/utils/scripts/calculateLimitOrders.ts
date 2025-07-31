import { OverlayData } from 'night-vision/dist/types';
import { CoinData } from '../../models/CoinData';
import { ChartSettings } from '../../models/ChartSettings';
import { getLimitOrderFilterMatch } from '../getLimitOrderFilterMatch';

export const calculateLimitOrders = (
  candlesData: OverlayData,
  coinData: CoinData,
  chartSettings: ChartSettings,
): OverlayData => {
  if (!coinData?.a || !coinData?.b) {
    return [];
  }

  const result = [];
  const maximumLimitOrders = 100;
  const lastPrice = candlesData[candlesData.length - 1]?.[4];


  const asksToDraw = [...coinData.a]
    .filter((i) => getLimitOrderFilterMatch(i, chartSettings))
    .sort((a, b) => {
      if (a.full_price < b.full_price) {
        return 1;
      }

      if (a.full_price > b.full_price) {
        return -1;
      }

      return 0;
    })
    .slice(0, maximumLimitOrders);


  const bidsToDraw = [...coinData.b]
    .filter((i) => getLimitOrderFilterMatch(i, chartSettings))
    .sort((a, b) => {
      if (a.full_price < b.full_price) {
        return 1;
      }

      if (a.full_price > b.full_price) {
        return -1;
      }

      return 0;
    })
    .slice(0, maximumLimitOrders);

  for (const limitOrder of asksToDraw) {
    result.push([limitOrder.created_time, { ...limitOrder, asks: true }]);
  }

  for (const limitOrder of bidsToDraw) {
    result.push([limitOrder.created_time, { ...limitOrder, asks: false }]);
  }

  return result as unknown as OverlayData;
};
