import { OrderbookMapSettings, OrderbookMapExchangeSettings } from './models';
import {
  Exchange,
  getMainExchangesData,
} from '../../../shared/models/Exchange';

interface OrderbookMapSettingsExchanges {
  [exchange: string]: OrderbookMapExchangeSettings;
}

const DEFAULT_ACTIVE_EXCHANGES: Exchange[] = [
  // 'BINANCE_SPOT',
  'BINANCE_FUTURES',
];

export const getOrderbookMapDefaultSettings = (): OrderbookMapSettings => {
  return {
    askOrdersColor: '#f13544',
    bidOrdersColor: '#089b80',
    blacklist: [
      'BTCUSDT',
      'ETHUSDT',
      'XRPUSDT',
      'CRVUSDT',
      'EOSUSDT',
      'BNBUSDT',
      'SOLUSDT',
    ],
    loaderMode: 'auto',
    chartTimeframe: '5m',
    loaderIntervalSec: 10,
    showExchange: true,
    showDistance: true,
    showCorrosionTime: false,
    showOrderSum: false,
    openChartOnHover: true,
    maxOrdersToShow: 40,
    maxOrdersDistance: 5,
    ordersDirection: 'all',
    chartCandlesLength: 550,
    exchangesSettings: getOrderbookMapExchangesDefaultSettings(),

    displayLargeCirce: true,
    largeCircleDistance: 3,
    displaySmallCircle: true,
    smallCircleDistance: 1
  };
};

export const initialOrderbookMapExchangesDefaultSettings: OrderbookMapExchangeSettings = {
  active: false,

  ordersMinCorrosionTime: 1,
  ordersBigCorrosionTime: 20,
  ordersMinSum: 400_000,
  limitOrderLife: 5,

  volumeFilterIsActive: false,
  volumeFromFilter: 0,
  volumeToFilter: 100_000_000_000,
  volumeFilterPeriod: '24h',
  priceChangeFilterIsActive: false,
  priceChangeFromFilter: 0,
  priceChangeToFilter: 1000,
  priceChangeFilterPeriod: '24h',
  round_density: false,
  singleDensityPerCoin: false,
  singleDensityPerCoinType: 'distance'
}

const getOrderbookMapExchangesDefaultSettings =
  (): OrderbookMapSettingsExchanges => {
    const exchanges = getMainExchangesData();
    const settings: OrderbookMapSettingsExchanges = {};

    for (const exchange of exchanges) {
      settings[exchange.exchange] = {
        ...initialOrderbookMapExchangesDefaultSettings,
        active: DEFAULT_ACTIVE_EXCHANGES.includes(exchange.exchange),
      };
    }

    return settings;
  };
