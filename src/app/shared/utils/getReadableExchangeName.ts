import { TranslateService } from "@ngx-translate/core";

export const getReadableExchangeName = (exchange: string, translateService: TranslateService) => {
  switch (exchange) {
    case 'BINANCE_SPOT':
      return translateService.instant('chart.binance_spot');
    case 'BINANCE_FUTURES':
      return translateService.instant('chart.binance_futures');
    case 'BINANCE_SPOT_WITHOUT_FUTURES':
      return translateService.instant('chart.binance_spot_without_futures');
    case 'BINANCE_SPOT_WITH_FUTURES':
      return translateService.instant('chart.binance_spot_with_futures');
    case 'BYBIT_SPOT':
      return translateService.instant('chart.bybit_spot');
    case 'BYBIT_FUTURES':
      return translateService.instant('chart.bybit_futures');
    case 'ALL':
      return translateService.instant('chart.all_exchanges');
  }

  return '';
};
