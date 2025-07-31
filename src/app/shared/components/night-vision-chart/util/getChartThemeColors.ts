import { ChartThemeSettings } from '../../../models/Preferences';

export const getChartThemeColors = (
  chartThemeSettings: ChartThemeSettings,
): { [key: string]: string } => {
  // const isLightTheme = document.body.classList.contains('light-theme');

  return {
    back: `linear-gradient(to bottom, ${chartThemeSettings.chartBackgroundColor}, ${chartThemeSettings.chartBackgroundSecondColor})`,
    grid: chartThemeSettings.showChartGrid
      ? chartThemeSettings.chartGridColor
      : 'transparent',
    text: chartThemeSettings.chartTextColor,
    textLG: chartThemeSettings.chartTextColor,
    llValue: chartThemeSettings.chartCrosshairColor,
    cross: chartThemeSettings.chartCrosshairColor,
    panel: chartThemeSettings.chartPanelColor,
    brush: chartThemeSettings.brushColor,
    ray: chartThemeSettings.horizontalLevelColor,
    candleUp: chartThemeSettings.candleBuyColor,
    candleDw: chartThemeSettings.candleSellColor,
    wickUp: chartThemeSettings.candleShadowBuyColor,
    wickDw: chartThemeSettings.candleShadowSellColor,
    volUp: chartThemeSettings.volumeBuyColor,
    volDw: chartThemeSettings.volumeSellColor,
  };
};
