import { TranslateService } from "@ngx-translate/core";

export const getVolumeSplashTooltip = (period: string, translateService: TranslateService): string => {
  let tooltip = '';
  const tooltipPostfix = translateService.instant('volumeSplash.tooltipPostfix');

  if (period === '5m' || period === 'interval_5m') {
      tooltip = translateService.instant('volumeSplash.period5m');
  }

  if (period === '10m' || period === 'interval_10m') {
      tooltip = translateService.instant('volumeSplash.period10m');
  }

  if (period === '15m' || period === 'interval_15m') {
      tooltip = translateService.instant('volumeSplash.period15m');
  }

  if (period === '20m' || period === 'interval_20m') {
      tooltip = translateService.instant('volumeSplash.period20m');
  }

  if (period === '30m' || period === 'interval_30m') {
      tooltip = translateService.instant('volumeSplash.period30m');
  }

  if (period === '1h' || period === 'interval_1h') {
      tooltip = translateService.instant('volumeSplash.period1h');
  }

  if (period === '2h' || period === 'interval_2h') {
      tooltip = translateService.instant('volumeSplash.period2h');
  }

  if (period === '6h' || period === 'interval_6h') {
      tooltip = translateService.instant('volumeSplash.period6h');
  }

  if (period === '12h' || period === 'interval_12h') {
      tooltip = translateService.instant('volumeSplash.period12h');
  }

  if (period === '24h' || period === 'interval_24h') {
      tooltip = translateService.instant('volumeSplash.period24h');
  }

  return tooltip + tooltipPostfix;
};