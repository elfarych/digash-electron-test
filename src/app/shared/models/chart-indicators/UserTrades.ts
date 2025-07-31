import { ChartIndicatorPropFormControl } from './ChartIndicatorsProps';

export type UserTradesIndicatorPropKeys = 'buyColor' | 'sellColor' | 'size';

export interface UserTradesIndicatorProps {
  buyColor: string;
  sellColor: string;
  size: number;
}

export const defaultUserTradesIndicatorProps: UserTradesIndicatorProps = {
  buyColor: '#00ff3d',
  sellColor: '#f10c34',
  // buyColor: '#2f9354',
  // sellColor: '#9a2b2b',
  size: 1,
};

export const userTradesIndicatorForm: ChartIndicatorPropFormControl<UserTradesIndicatorPropKeys>[] =
  [
    {
      key: 'buyColor',
      label: 'Buy order color',
      type: 'color',
      value: defaultUserTradesIndicatorProps.buyColor,
    },
    {
      key: 'sellColor',
      label: 'Sell order color',
      type: 'color',
      value: defaultUserTradesIndicatorProps.sellColor,
    },
    // {
    //   key: 'size',
    //   type: 'number',
    //   label: 'Size',
    //   value: defaultUserTradesIndicatorProps.size,
    // },
  ];
