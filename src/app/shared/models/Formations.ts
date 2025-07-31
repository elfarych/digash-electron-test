import { TranslateService } from '@ngx-translate/core';

export type Formations =
  | 'None'
  | 'BOS'
  | 'BMS'
  | 'HorizontalLevelWithLimitOrder'
  | 'HorizontalLevels'
  | 'TrendLevels'
  | 'DiagonalLevelWithLimitOrder'
  | 'CoinsWithDensity'
  | 'ActiveCoins';

export type FormationFilterIntervalType =
  | 'interval_1m'
  | 'interval_3m'
  | 'interval_5m'
  | 'interval_15m'
  | 'interval_30m'
  | 'interval_1h'
  | 'interval_2h'
  | 'interval_6h'
  | 'interval_12h'
  | 'interval_24h';

export const formationsList = (
  translateService: TranslateService,
): {
  value: Formations;
  label: string;
  specialCode?: string;
}[] => [
  { value: 'None', label: translateService.instant('formations.none') },
  {
    value: 'HorizontalLevelWithLimitOrder',
    label: translateService.instant('formations.horizontalLevelWithLimitOrder'),
  },
  {
    value: 'ActiveCoins',
    label: translateService.instant('formations.activeCoins')
  },
  {
    value: 'CoinsWithDensity',
    label: translateService.instant('formations.coinsWithDensity'),
  },
  {
    value: 'HorizontalLevels',
    label: translateService.instant('formations.horizontalLevels'),
  },
  {
    value: 'TrendLevels',
    label: translateService.instant('formations.trendLevels'),
  },
];

export const getFormationsList = (
  specialCodes: string,
  translateService: TranslateService,
): { value: Formations; label: string; specialCode?: string }[] => {
  return formationsList(translateService).filter((formation) => {
    if (formation.specialCode) {
      return specialCodes.includes(formation.specialCode);
    }
    return true;
  });
};

export const getFormationLabel = (
  formation: Formations,
  translateService: TranslateService,
): string => {
  return formationsList(translateService).find(
    ({ value, label }) => value === formation,
  ).label;
};
