import { ChartIndicatorPropFormControl } from './ChartIndicatorsProps';

export type LiquidationsBubblesPropKeys =
  | 'drawLines'
  | 'hideSmallLiquidations'
  | 'color';

export interface LiquidationsBubblesProps {
  drawLines: boolean;
  hideSmallLiquidations: boolean;
  color: string;
}

export const defaultLiquidationsBubblesProps: LiquidationsBubblesProps = {
  drawLines: false,
  hideSmallLiquidations: true,
  color: '#46b888',
};

export const LiquidationsBubblesForm: ChartIndicatorPropFormControl<LiquidationsBubblesPropKeys>[] =
  [
    {
      key: 'drawLines',
      label: 'Draw lines from liquidation price',
      type: 'boolean',
      value: undefined,
    },
    {
      key: 'hideSmallLiquidations',
      label: 'Hide small liquidations',
      type: 'boolean',
      value: undefined,
    },
    {
      key: 'color',
      label: 'Bubbles color',
      type: 'color',
      value: undefined,
    },
  ];
