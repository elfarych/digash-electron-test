import { ChartIndicatorPropFormControl } from './ChartIndicatorsProps';

export type OIPropKeys = 'color' | 'lineWidth';

export interface OIProps {
  color: string;
  lineWidth: number;
}

export const defaultOIProps: OIProps = {
  color: '#ecd5d9',
  lineWidth: 2,
};

export const OIForm: ChartIndicatorPropFormControl<OIPropKeys>[] = [
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
