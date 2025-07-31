import { TranslateService } from '@ngx-translate/core';
import { DropdownOptions } from '../types/base.types';

export type ChartYScaleType = 'Regular' | 'Log';

export const getChartYScaleTypes = (
  translateService: TranslateService,
): DropdownOptions<ChartYScaleType> => [
  {
    value: 'Regular',
    label: translateService.instant('chartSettings.regular'),
  },
  { value: 'Log', label: translateService.instant('chartSettings.log') },
];
