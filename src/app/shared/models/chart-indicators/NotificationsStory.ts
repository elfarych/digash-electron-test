import { TranslateService } from '@ngx-translate/core';
import { ChartIndicatorPropFormControl } from './ChartIndicatorsProps';

export interface NotificationsStoryProps {
  color: string;
  size: number;
  showLabels: boolean;
  markerOutline: boolean;
  outlineWidth: number;
}

export const defaultNotificationsStoryProps: NotificationsStoryProps = {
  color: '#0a9d61',
  showLabels: true,
  markerOutline: false,
  size: 8,
  outlineWidth: 1,
};

export type NotificationsStoryPropKeys =
  | 'color'
  | 'size'
  | 'showLabels'
  | 'markerOutline'
  | 'outlineWidth';

export const notificationsStoryForm = (
  translateService: TranslateService,
): ChartIndicatorPropFormControl<NotificationsStoryPropKeys>[] => [
  {
    key: 'color',
    label: 'Marker color',
    type: 'color',
    value: undefined,
  },
  {
    key: 'size',
    label: 'Size',
    type: 'number',
    value: undefined,
  },
  {
    key: 'showLabels',
    label: 'Show labels',
    type: 'boolean',
    value: false,
  },
  // {
  //   key: 'markerOutline',
  //   label: 'Marker outline',
  //   type: 'boolean',
  //   value: false
  // },
  // {
  //   key: 'outlineWidth',
  //   label: 'Marker outline with',
  //   type: 'number',
  //   value: false
  // },
];
