import { OverlayData } from 'night-vision/dist/types';
import { calculateLimitOrders } from './calculateLimitOrders';

import { CoinData } from '../../models/CoinData';
import { ChartSettings } from '../../models/ChartSettings';
import { Preferences } from '../../models/Preferences';
import { getTextColor } from '../../models/chart-indicators/CoinData';

export const convertCandlesToLimitOrdersOverlay = (
  candlesData: OverlayData,
  coinData: CoinData,
  chartSettings: ChartSettings,
  preferences: Preferences,
  fullChart = true,
  chartInOverlay = false,
) => {
  const textColor = getTextColor();
  return {
    name: fullChart ? 'Плотности' : '',
    type: 'LimitOrdersLevels',
    props: {
      askLevelColor: preferences.chartThemeSettings.sellLimitOrderColor,
      bidLevelColor: preferences.chartThemeSettings.buyLimitOrderColor,
      fullChart,
      textColor,
      chartInOverlay,
    },
    settings: {
      zIndex: 1,
      showLegend: false,
    },
    data: calculateLimitOrders(candlesData, coinData, chartSettings),
  };
};
