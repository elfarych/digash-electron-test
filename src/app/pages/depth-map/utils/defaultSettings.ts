import {
  DepthMapExchangeSettings,
  DepthMapOrderFilterValues,
  DepthMapSettings,
} from './models';
import {
  Exchange,
  getMainExchangesData,
} from '../../../shared/models/Exchange';

interface DepthMapSettingsExchanges {
  [exchange: string]: DepthMapExchangeSettings;
}

const DEFAULT_ACTIVE_EXCHANGES: Exchange[] = [
  'BINANCE_SPOT',
  'BINANCE_FUTURES',
];

export const getDepthMapDefaultSettings = (): DepthMapSettings => {
  return {
    askOrdersColor: '#f13544',
    bidOrdersColor: '#089b80',
    blacklist: [],
    loaderMode: 'auto',
    chartTimeframe: '5m',
    loaderIntervalSec: 10,
    maxOrdersInColumn: 10,
    showExchange: true,
    showDistance: true,
    showCorrosionTime: false,
    showOrderSum: false,
    exchangesSettings: getDepthMapExchangesDefaultSettings(),
  };
};

export const defaultSmallDepthMapOrderFilterValues: DepthMapOrderFilterValues =
  {
    minCorrosionTime: 5,
    minOrderSum: 50_000,
    filterByOrderSum: false,
  };

export const defaultMediumDepthMapOrderFilterValues: DepthMapOrderFilterValues =
  {
    minCorrosionTime: 10,
    minOrderSum: 500_000,
    filterByOrderSum: false,
  };

export const defaultLargeDepthMapOrderFilterValues: DepthMapOrderFilterValues =
  {
    minCorrosionTime: 20,
    minOrderSum: 1_000_000,
    filterByOrderSum: false,
  };

const getDepthMapExchangesDefaultSettings = (): DepthMapSettingsExchanges => {
  const exchanges = getMainExchangesData();
  const settings: DepthMapSettingsExchanges = {};

  for (const exchange of exchanges) {
    settings[exchange.exchange] = {
      active: DEFAULT_ACTIVE_EXCHANGES.includes(exchange.exchange),
      smallOrderFilterValues: defaultSmallDepthMapOrderFilterValues,
      mediumOrderFilterValues: defaultMediumDepthMapOrderFilterValues,
      largeOrderFilterValues: defaultLargeDepthMapOrderFilterValues,
      volumeFilterIsActive: false,
      volumeFromFilter: 0,
      volumeToFilter: 100_000_000_000,
      volumeFilterPeriod: '24h',
      priceChangeFilterIsActive: false,
      priceChangeFromFilter: 0,
      priceChangeToFilter: 1000,
      priceChangeFilterPeriod: '24h',
    };
  }

  return settings;
};
