import { Timeframe } from '../../../models/Timeframe';

export type ChartLayout = 'single' | 'vertical' | 'horizontal' | 'combined';

export interface ChartLayoutOption {
  layout: ChartLayout;
  icon: string;
}

export interface ChartLayoutOptions {
  [key: string]: ChartLayoutOption;
}

export const chartLayoutOptions: ChartLayoutOptions = {
  single: {
    layout: 'single',
    icon: 'assets/svg/square.svg',
  },
  vertical: {
    layout: 'vertical',
    icon: 'assets/svg/layout_2c.svg',
  },
  horizontal: {
    layout: 'horizontal',
    icon: 'assets/svg/layout_2r.svg',
  },
  combined: {
    layout: 'combined',
    icon: 'assets/svg/layout_2c_2r.svg',
  },
};

export const getChartLayoutOptions = (): ChartLayoutOption[] => {
  return Object.values(chartLayoutOptions);
};

export interface ChartLayoutData {
  id: string;
  timeframe: Timeframe;
}
