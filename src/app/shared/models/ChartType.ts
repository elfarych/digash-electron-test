import { TranslateService } from '@ngx-translate/core';
import { DropdownOptions } from '../types/base.types';

export type ChartType = 'candlestick' | 'area' | 'line' | 'cluster' | 'bars';

export const getChartTypes = (
  translateService: TranslateService,
): DropdownOptions<ChartType> => [
  {
    value: 'candlestick',
    label: translateService.instant('chartSettings.candlestick'),
  },
  { value: 'bars', label: translateService.instant('chartSettings.bars') },
];
