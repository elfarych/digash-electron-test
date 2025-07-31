import { ChartIndicatorPropFormControl } from './ChartIndicatorsProps';

export type ATRPropKeys = 'color' | 'lineWidth' | 'period';

export interface ATRProps {
  color: string;
  lineWidth: number;
  period: number;
}

export const defaultATRProps: ATRProps = {
  color: '#ecd5d9',
  lineWidth: 2,
  period: 14,
};

export const ATRForm: ChartIndicatorPropFormControl<ATRPropKeys>[] = [
  {
    key: 'period',
    type: 'number',
    label: 'Период',
    value: undefined,
  },
  {
    key: 'lineWidth',
    label: 'Ширина линии',
    type: 'number',
    value: undefined,
  },
  {
    key: 'color',
    label: 'Цвет линии',
    type: 'color',
    value: undefined,
  },
];
