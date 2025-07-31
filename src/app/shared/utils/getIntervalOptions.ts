import { DropdownOptions, FilterIntervalType } from '../types/base.types';

export const filterIntervalOptions: DropdownOptions<FilterIntervalType> = [
  { value: 'interval_1m', label: '1 минута' },
  { value: 'interval_3m', label: '3 минуты' },
  { value: 'interval_5m', label: '5 минут' },
  { value: 'interval_15m', label: '15 минут' },
  { value: 'interval_30m', label: '30 минут' },
  { value: 'interval_1h', label: '1 час' },
  { value: 'interval_2h', label: '2 часа' },
  { value: 'interval_6h', label: '6 часов' },
  { value: 'interval_12h', label: '12 часов' },
  { value: 'interval_24h', label: '24 часа' },
];
