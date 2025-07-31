import { Preferences } from '../../../models/Preferences';
import { createReducer, on } from '@ngrx/store';
import { PreferencesActions } from './preferences.actions';

export const initialPreferencesState: Preferences = {
  lineValue: 'V24h',
  layout: '3c',
  chartLayout: 'single',
  theme: 'dark',
  loaded: false,
  chartThemeSettings: {
    candleBuyColor: '#0a9d61',
    candleSellColor: '#da2647',
    candleShadowBuyColor: '#0a9d61',
    candleShadowSellColor: '#da2647',
    volumeBuyColor: '#0a9d61',
    volumeSellColor: '#da2647',
    chartBackgroundColor: '#0e0e18',
    chartBackgroundSecondColor: '#0e0e18',
    chartGridColor: 'rgba(255,255,255,0)',
    chartCrosshairColor: '#B6B6B6',
    chartTextColor: '#F3F3F3',
    chartPanelColor: '#0e0e18',
    buyLimitOrderColor: '#386D2E',
    sellLimitOrderColor: '#7C1F3E',
    horizontalLevelColor: '#B6B6B6',
    dailyHighLowColor: '#4B38B3',
    trendLevelSupportColor: '#64FF66',
    trendLevelResistanceColor: '#FF3F3F',
    brushColor: '#dc9800',
    rectangleColor: '#B6B6B6',
    showChartGrid: true,
    showVolume: true,
    chartYScale: 'Regular',
    chartType: 'candlestick',
    doubleClickAlert: false,
    showLegend: true,
  },
};

export const preferencesReducer = createReducer(
  initialPreferencesState,

  on(PreferencesActions.loadPreferencesSuccess, (state, { data }) => {
    return { ...initialPreferencesState, ...data, loaded: true };
  }),

  on(PreferencesActions.updatePreferencesSuccess, (state, { data }) => {
    return { ...initialPreferencesState, ...data, loaded: true };
  }),
);
