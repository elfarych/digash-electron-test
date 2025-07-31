import { Overlay } from 'night-vision/dist/types';
import { ChartSettings } from '../../models/ChartSettings';
import { Preferences } from '../../models/Preferences';
import { calculateHorizontalLevels } from '../calculateHorizontalLevels';
import { CoinData } from '../../models/CoinData';

export const convertCandlesToHorizontalLevelsOverlay = (
  preferences: Preferences,
  candlesData: number[][],
  fullChart = true,
  chartSettings: ChartSettings,
  coinData: CoinData,
  roundLevels = false,
  currentPrice = 0,
): Overlay => {
  return {
    name: fullChart ? 'Горизонтальные уровни' : '',
    type: 'HorizontalLevels',
    props: {
      color: preferences.chartThemeSettings.horizontalLevelColor,
      fullChart,
    },
    settings: {
      zIndex: 1,
      showLegend: false,
    },
    data: calculateHorizontalLevels(
      candlesData,
      chartSettings,
      coinData,
      roundLevels,
      currentPrice,
    ),
  } as Overlay;
};
