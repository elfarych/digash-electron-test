import { OverlayData } from 'night-vision/dist/types';
import { TrendLevel } from '../../models/CoinData';
import { Preferences } from '../../models/Preferences';
import { calculateTrendLines } from '../calculateTrendLines';
import { ChartSettings } from '../../models/ChartSettings';

export const convertCandlesToTrendlineLevelsOverlay = (
  candlesData: OverlayData,
  chartSettings: ChartSettings,
  preferences: Preferences,
  fullChart = true,
  useBackendLevels = false,
  serverLevels: { [key: string]: TrendLevel[] } = {},
) => {
  return {
    name: fullChart ? 'Трендовые уровни' : '',
    type: 'TrendLevels',
    props: {
      colorLow: preferences.chartThemeSettings.trendLevelSupportColor,
      colorHigh: preferences.chartThemeSettings.trendLevelResistanceColor,
    },
    settings: {
      zIndex: 1,
      showLegend: false,
    },
    data: calculateTrendLines(
      candlesData,
      chartSettings,
      useBackendLevels,
      serverLevels,
    ),
  };
};
