import { HighLowData } from '../../models/CoinData';
import { Preferences } from '../../models/Preferences';
import { calculateDailyHighLows } from './calculateDailyHighLows';

export const convertDailyHighLowsOverlay = (
  data: HighLowData,
  preferences: Preferences,
  fullChart,
  highTitle: string,
  lowTitle: string,
) => {
  return {
    name: 'Дневной лой и хай',
    type: 'HighLowLevels',
    props: {
      color: preferences.chartThemeSettings.dailyHighLowColor,
      fullChart,
      highTitle,
      lowTitle,
    },
    settings: {
      zIndex: 1,
      showLegend: false,
    },
    data: calculateDailyHighLows(data),
  };
};
