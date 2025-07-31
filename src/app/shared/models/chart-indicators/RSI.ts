import { ChartIndicatorPropFormControl } from './ChartIndicatorsProps';
import { CalculationCandleSource } from './CalculationCandleSource';
import { TranslateService } from '@ngx-translate/core';

export type RSIPropKeys =
  | 'length'
  | 'source'
  | 'color'
  | 'backColor'
  | 'bandColor'
  | 'upperBand'
  | 'lowerBand';

export interface RSIProps {
  length: number;
  source: CalculationCandleSource;

  color?: string;
  // backColor?: string;
  bandColor?: string;
  lineWidth?: number;
  upperBand?: number;
  lowerBand?: number;
}

export const defaultRSIProps: RSIProps = {
  length: 14,
  source: 'close',
  lowerBand: 30,
  upperBand: 70,
  color: '#ecd5d9',
  // backColor: '#381e9c16',
  bandColor: '#535559',
};

export const RSIForm = (translateService: TranslateService): ChartIndicatorPropFormControl<RSIPropKeys>[] => [
  {
    key: 'length',
    type: 'number',
    label: 'Период',
    value: undefined,
  },
  {
    key: 'source',
    label: 'Источник',
    type: 'dropdown',
    value: undefined,
    options: [
      { value: translateService.instant('price.open'), key: 'open' },
      { value: translateService.instant('price.high'), key: 'high' },
      { value: translateService.instant('price.low'), key: 'low' },
      { value: translateService.instant('price.close'), key: 'close' }
    ],
  },

  {
    key: 'upperBand',
    label: 'Верхний диапазон',
    type: 'number',
    value: undefined,
  },
  {
    key: 'lowerBand',
    label: 'Нижний диапазон',
    type: 'number',
    value: undefined,
  },

  {
    key: 'color',
    label: 'Цвет линии',
    type: 'color',
    value: undefined,
  },
  // {
  //   key: 'backColor',
  //   label: 'Back color',
  //   type: 'color',
  //   value: undefined
  // },
  {
    key: 'bandColor',
    label: 'Цвет диапозона',
    type: 'color',
    value: undefined,
  },
];
