import { ChartIndicatorPropFormControl } from './ChartIndicatorsProps';

export type SessionZonesPropKeys =
  | 'showLondon'
  | 'showTokyo'
  | 'showNewYork'
  | 'showSydney'
  | 'LondonColor'
  | 'TokyoColor'
  | 'NewYorkColor'
  | 'SydneyColor';

export interface SessionZonesProps {
  showLondon: boolean;
  showTokyo: boolean;
  showNewYork: boolean;
  showSydney: boolean;
  LondonColor: string;
  TokyoColor: string;
  NewYorkColor: string;
  SydneyColor: string;
}

export const defaultSessionZonesProps: SessionZonesProps = {
  showLondon: true,
  showTokyo: true,
  showNewYork: true,
  showSydney: true,
  LondonColor: '#FFCE56',
  TokyoColor: '#4BC0C0',
  NewYorkColor: '#9966FF',
  SydneyColor: '#FF6384',
};

export const SessionZonesForm: ChartIndicatorPropFormControl<SessionZonesPropKeys>[] =
  [
    {
      key: 'showLondon',
      label: '',
      type: 'boolean',
      value: undefined,
    },
    {
      key: 'LondonColor',
      label: '',
      type: 'color',
      value: defaultSessionZonesProps.LondonColor,
    },
    {
      key: 'showTokyo',
      label: '',
      type: 'boolean',
      value: undefined,
    },
    {
      key: 'TokyoColor',
      label: '',
      type: 'color',
      value: defaultSessionZonesProps.TokyoColor,
    },
    {
      key: 'showNewYork',
      label: '',
      type: 'boolean',
      value: undefined,
    },
    {
      key: 'NewYorkColor',
      label: '',
      type: 'color',
      value: defaultSessionZonesProps.LondonColor,
    },
    {
      key: 'showSydney',
      label: '',
      type: 'boolean',
      value: undefined,
    },
    {
      key: 'SydneyColor',
      label: '',
      type: 'color',
      value: defaultSessionZonesProps.SydneyColor,
    },
  ];
