import { Layout } from './Layout';
import { SortingId } from './CoinsSorting';
import { ChartLayout } from '../components/mini-chart/models/ChartLayout';
import { ChartYScaleType } from './ChartYScaleTypes';
import { ChartType } from './ChartType';

export const appColorThemes: AppColorTheme[] = [
  {
    name: 'Стандартный',
    src: 'arya-green.css',
    dark: true,
    color: '#81c784',
    bgColor: '#1e1e1e',
  },
  {
    name: 'Стандартный синий',
    src: 'arya-blue.css',
    dark: true,
    color: '#64b5f6',
    bgColor: '#1e1e1e',
  },
  {
    name: 'Светлый (строгий)',
    src: 'fluent-light.css',
    dark: false,
    color: '#0078d4',
    bgColor: '#ffffff',
  },
  {
    name: 'Светлый - синий',
    src: 'lara-light-blue.css',
    dark: false,
    color: '#3b82f6',
    bgColor: '#eff3f8',
  },
  {
    name: 'Светлый - индиго',
    src: 'lara-light-indigo.css',
    dark: false,
    color: '#6366f1',
    bgColor: '#eff3f8',
  },
  {
    name: 'Светлый - фиолетовый',
    src: 'lara-light-purple.css',
    dark: false,
    color: '#8b5cf6',
    bgColor: '#eff3f8',
  },
  {
    name: 'Светлый - бирюзовый',
    src: 'lara-light-teal.css',
    dark: false,
    color: '#14b8a6',
    bgColor: '#eff3f8',
  },
  {
    name: 'Темный - синий',
    src: 'lara-dark-blue.css',
    dark: true,
    color: '#3b82f6',
    bgColor: '#071426',
  },
  {
    name: 'Темный - индиго',
    src: 'lara-dark-indigo.css',
    dark: true,
    color: '#6366f1',
    bgColor: '#071426',
  },
  {
    name: 'Темный - фиолетовый',
    src: 'lara-dark-purple.css',
    dark: true,
    color: '#8b5cf6',
    bgColor: '#071426',
  },
  {
    name: 'Темный - бирюзовый',
    src: 'lara-dark-teal.css',
    dark: true,
    color: '#14b8a6',
    bgColor: '#071426',
  },
];

export interface AppColorTheme {
  name: string;
  src: string;
  dark: boolean;
  color: string;
  bgColor: string;
}

export type AppTheme = 'dark' | 'light';

export interface ChartThemeSettings {
  candleBuyColor: string;
  candleSellColor: string;
  candleShadowBuyColor: string;
  candleShadowSellColor: string;
  volumeBuyColor: string;
  volumeSellColor: string;
  chartBackgroundColor: string;
  chartBackgroundSecondColor: string;
  chartGridColor: string;
  showChartGrid: boolean;
  chartCrosshairColor: string;
  chartTextColor: string;
  chartPanelColor: string;
  buyLimitOrderColor: string;
  sellLimitOrderColor: string;
  trendLevelSupportColor: string;
  trendLevelResistanceColor: string;
  horizontalLevelColor: string;
  rectangleColor: string;
  brushColor: string;
  dailyHighLowColor: string;
  showVolume: boolean;
  chartYScale: ChartYScaleType;
  chartType: ChartType;
  doubleClickAlert: boolean;
  showLegend: boolean;
}

export interface Preferences {
  lineValue: SortingId;
  layout: Layout;
  appColorThemeSrc?: string;
  theme?: AppTheme;

  loaded: boolean;
  chartLayout: ChartLayout;
  chartThemeSettings: ChartThemeSettings;
}
