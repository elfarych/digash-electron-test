import { RSIProps } from './RSI';
import { OIProps } from './OI';
import { CoinDataProps } from './CoinData';
import { UserTradesIndicatorProps } from './UserTrades';
import { NotificationsStoryProps } from './NotificationsStory';
import { LiquidationsBubblesProps } from './LiquidationsBubbles';
import { SessionZonesProps } from './SessionZones';

export type ChartIndicatorPropFormControlType =
  | 'number'
  | 'text'
  | 'color'
  | 'boolean'
  | 'dropdown';

export type ChartIndicatorsProps =
  | RSIProps
  | OIProps
  | CoinDataProps
  | UserTradesIndicatorProps
  | NotificationsStoryProps
  | LiquidationsBubblesProps
  | SessionZonesProps;

export interface ChartIndicatorPropFormControl<T = string> {
  type: ChartIndicatorPropFormControlType;
  label: string;
  key: T;
  value: string | number | boolean;
  options?: { key: string; value: string }[];
}

export class ChartIndicatorPropFormControlBase {
  public value: string | number | boolean;
  public key: string;
  public label: string;
  public required: boolean;
  public order: number;
  public type: ChartIndicatorPropFormControlType;
  public options: { key: string; value: string }[];

  constructor(
    options: {
      value?: string | number | boolean;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      type?: ChartIndicatorPropFormControlType;
      options?: { key: string; value: string }[];
    } = {},
  ) {
    this.value = options.value;
    this.key = options.key;
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.type = options.type || 'text';
    this.options = options.options || [];
  }
}
