import { TranslateService } from '@ngx-translate/core';

export interface ComparisonTableData {
  name: string;
  withoutReg: boolean;
  withoutRegTooltip?: string;
  withReg: boolean;
  withRegTooltip?: string;
  trader: boolean;
}

export const comparisonTable0 = (
  translateService: TranslateService,
): ComparisonTableData[] => {
  return [
    {
      name: translateService.instant('premium.screenerAccess'),
      withoutReg: true,
      withoutRegTooltip: translateService.instant(
        'premium.screenerAccessWithoutRegTooltip',
      ),
      withReg: true,
      withRegTooltip: translateService.instant(
        'premium.screenerAccessWithRegTooltip',
      ),
      trader: true,
    },
    {
      name: translateService.instant('premium.favoriteCoinsAccess'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant(
        'premium.favoriteCoinsWithRegTooltip',
      ),
      trader: true,
    },
    {
      name: translateService.instant('premium.priceAlertsAccess'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant(
        'premium.priceAlertsWithRegTooltip',
      ),
      trader: true,
    },
    {
      name: translateService.instant('premium.coinsSectionAccess'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant(
        'premium.coinsSectionWithRegTooltip',
      ),
      trader: true,
    },
    {
      name: translateService.instant('premium.sortingTypes'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.indicators'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.coinHistoryAccess'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.listings_access'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.depth_map_access'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.alerts_access'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.psychologyAccess'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.automatic_levels'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
  ];
};

export const comparisonTable1 = (
  translateService: TranslateService,
): ComparisonTableData[] => {
  return [
    {
      name: translateService.instant('premium.all_exchanges'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant('premium.only_binance_spot_fut'),
      trader: true,
    },
    {
      name: translateService.instant('premium.sortingTypes'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.indicators'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.coinDataAccess'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.workspaceEditing'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant(
        'premium.workspaceEditingTooltip',
      ),
      trader: true,
    },
    {
      name: translateService.instant('premium.allCoinsAccess'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant('premium.topCoinsAccessTooltip'),
      trader: true,
    },
    {
      name: translateService.instant('premium.favoriteCoinsAccess'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant(
        'premium.favoriteCoinsWithRegTooltip',
      ),
      trader: true,
    },
    {
      name: translateService.instant('premium.volumeFilter'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.btc_correlation'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.multipleWorkspacesAccess'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.autoHorizontalTrendlines'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.densityOnCharts'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.densityTooltips'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.patternFiltering'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.realtimeDataUpdates'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
  ];
};

export const comparisonTable2 = (
  translateService: TranslateService,
): ComparisonTableData[] => {
  return [
    {
      name: translateService.instant('premium.priceCrossAlerts'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant(
        'premium.priceCrossAlertsTooltip',
      ),
      trader: true,
    },
    {
      name: translateService.instant('premium.newDensitiesAlerts'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.splash_alerts'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.priceChanges'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.coins_listings'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.coinVolatility'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.btcDecoupling'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
  ];
};

export const comparisonTable3 = (
  translateService: TranslateService,
): ComparisonTableData[] => {
  return [
    {
      name: translateService.instant('premium.all_exchanges'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant('premium.only_binance_spot_fut'),
      trader: true,
    },
    {
      name: translateService.instant('premium.allCoinsAccess'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.coinDataAccess'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.indicators'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.drawingTools'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.sortingTypes'),
      withoutReg: false,
      withReg: true,
      withRegTooltip: translateService.instant('premium.sortingTypesTooltip'),
      trader: true,
    },
    {
      name: translateService.instant('premium.autoHorizontalTrendlines'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.densityOnCharts'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.densityTooltips'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.volumeFilter'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.correlation_filter_from_to'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.coinGrid'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
  ];
};

export const comparisonTable4 = (
  translateService: TranslateService,
): ComparisonTableData[] => {
  return [
    {
      name: translateService.instant('premium.binanceFutures'),
      withoutReg: false,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.binanceSpot'),
      withoutReg: true,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.bybitSpot'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.bybitFutures'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.bitgetSpot'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.bitgetFutures'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.gateSpot'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.gateFutures'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.okxSpot'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.okxFutures'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.mexcSpot'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.mexcFutures'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
  ];
};

export const comparisonTable5 = (
  translateService: TranslateService,
): ComparisonTableData[] => {
  return [
    {
      name: translateService.instant('premium.all_exchanges'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.coinLimitOrderDataAccess'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.sorting_and_filtering'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.density_hint'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.realtimeDataUpdates'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
  ];
};

export const comparisonTable6 = (
  translateService: TranslateService,
): ComparisonTableData[] => {
  return [
    {
      name: translateService.instant('premium.all_exchanges'),
      withoutReg: true,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.coins_sorting'),
      withoutReg: true,
      withReg: true,
      trader: true,
    },
    {
      name: translateService.instant('premium.listing_alerts'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
  ];
};

export const comparisonTable7 = (
  translateService: TranslateService,
): ComparisonTableData[] => {
  return [
    {
      name: translateService.instant('premium.alerts'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
    {
      name: translateService.instant('premium.frequency'),
      withoutReg: false,
      withReg: false,
      trader: true,
    },
  ];
};
