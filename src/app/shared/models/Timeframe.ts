import { TranslateService } from "@ngx-translate/core";

export type Timeframe =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '1w';

// export const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d'];
export const getTimeframes = (translateService: TranslateService): { name: Timeframe; label: string }[] => {
  return [
    { name: '1m', label: translateService.instant('timeframes.1m') },
    { name: '5m', label: translateService.instant('timeframes.5m') },
    { name: '15m', label: translateService.instant('timeframes.15m') },
    { name: '1h', label: translateService.instant('timeframes.1h') },
    { name: '4h', label: translateService.instant('timeframes.4h') },
    { name: '1d', label: translateService.instant('timeframes.1d') },
  ];
}
// export const timeframes: Timeframe[] = ['1m', '5m', '1h'];

export const TimeframeToRus = {
  '1m': '1м',
  '3m': '3м',
  '5m': '5м',
  '15m': '15м',
  '30m': '30м',
  '1h': '1ч',
  '2h': '2ч',
  '4h': '4ч',
  '6h': '6ч',
  '12h': '12ч',
  '1d': '24ч',
};
