import { calculateLifetime } from 'src/app/shared/utils/calculateLifetime';
import { CoinData } from '../../../shared/models/CoinData';
import { Exchange } from '../../../shared/models/Exchange';
import { LimitOrderData } from '../../../shared/models/LimitOrderData';
import {
  priceChangeIntervalsKayMap,
  volumeSumIntervalsKeyMap,
} from '../../../shared/utils/intervalMaps';
import { getOrderbookMapDefaultSettings } from './defaultSettings';
import {
  OrderbookMapCoinsData,
  OrderbookMapData,
  OrderbookMapExchangeSettings,
  OrderbookMapLimitOrderData,
  OrderBookMapOrdersDirection,
  OrderbookMapSettings,
  SingleDensityPerCoinType,
} from './models';
import { coinsBlacklist } from '../../../shared/utils/blacklist';

const isCoinDataWithinFilter = (
  coinData: CoinData,
  settings: OrderbookMapSettings,
  exchange: string,
  symbol: string,
): boolean => {
  const exchangeSettings = settings.exchangesSettings[exchange];

  if (settings.blacklist.includes(symbol) || coinsBlacklist.includes(symbol))
    return false;

  if (!coinData.volume_data || !coinData.price_changes) return false;

  const coinVolume =
    coinData.volume_data?.[
      volumeSumIntervalsKeyMap?.[exchangeSettings.volumeFilterPeriod]
    ] ?? 0;

  const coinPriceChange = Math.abs(
    coinData.price_changes?.[
      priceChangeIntervalsKayMap?.[exchangeSettings.priceChangeFilterPeriod]
    ] ?? 0,
  );

  const volumeFromCondition: boolean = exchangeSettings.volumeFilterIsActive
    ? coinVolume >= exchangeSettings.volumeFromFilter
    : true;

  const volumeToCondition: boolean = exchangeSettings.volumeFilterIsActive
    ? coinVolume < exchangeSettings.volumeToFilter
    : true;

  const priceChangeFromCondition: boolean =
    exchangeSettings.priceChangeFilterIsActive
      ? coinPriceChange >= exchangeSettings.priceChangeFromFilter
      : true;

  const priceChangeToCondition: boolean =
    exchangeSettings.priceChangeFilterIsActive
      ? coinPriceChange < exchangeSettings.priceChangeToFilter
      : true;

  return (
    volumeFromCondition &&
    volumeToCondition &&
    priceChangeFromCondition &&
    priceChangeToCondition
  );
};

const getPercentage = (part: number, total: number): number => {
  if (total === 0) {
    return 0;
  }
  if (part > total) {
    return 100;
  }
  const percentage = (part / total) * 100;
  return percentage;
};

const getOrderSizeInPercent = (
  order: LimitOrderData,
  exchangeSettings: OrderbookMapExchangeSettings,
): number => {
  return getPercentage(
    order.corrosion_time,
    exchangeSettings.ordersBigCorrosionTime,
  );
};

const processCoinOrders = (
  coinData: CoinData,
  orders: LimitOrderData[],
  exchange: Exchange,
  symbol: string,
  settings: OrderbookMapSettings,
): OrderbookMapLimitOrderData[] => {
  const exchangeSettings = settings.exchangesSettings[exchange];
  const defaultSettings = getOrderbookMapDefaultSettings();
  const maxOrderDistance =
    settings.maxOrdersDistance ?? defaultSettings.maxOrdersDistance;

  if (!orders?.length) return [];

  const densitiesPerCoin = 0;

  let filteredOrders = orders.reduce<OrderbookMapLimitOrderData[]>(
    (acc, order) => {
      try {
        const lifetimeCondition =
          Math.max(calculateLifetime(order), 0) >=
          exchangeSettings.limitOrderLife;
        const round = exchangeSettings.round_density ? order.round : true;

        if (
          isCoinDataWithinFilter(coinData, settings, exchange, symbol) &&
          order.corrosion_time >= exchangeSettings.ordersMinCorrosionTime &&
          order.full_price >= exchangeSettings.ordersMinSum &&
          order.distance <= maxOrderDistance &&
          lifetimeCondition &&
          round
        ) {
          acc.push({
            ...order,
            symbol,
            exchange,
            densitiesPerCoin: 0,
            sizeInPercent: getOrderSizeInPercent(order, exchangeSettings),
          });
        }
      } catch (error) {
        console.log(error);
      }
      return acc;
    },
    [],
  );

  if (exchangeSettings.singleDensityPerCoin) {
    filteredOrders = filteredOrders.map((order) => ({
      ...order,
      densitiesPerCoin: filteredOrders.length,
    }));
  }

  const deduplicateBy = (key: SingleDensityPerCoinType) =>
    Array.from(
      new Map(
        filteredOrders
          .sort((a, b) =>
            key === 'corrosion_time'
              ? a.corrosion_time - b.corrosion_time
              : b.distance - a.distance,
          )
          .map((item) => [item.symbol, item]),
      ).values(),
    );

  if (exchangeSettings.singleDensityPerCoin) {
    if (
      ['corrosion_time', 'distance'].includes(
        exchangeSettings.singleDensityPerCoinType,
      )
    ) {
      return deduplicateBy(exchangeSettings.singleDensityPerCoinType);
    }
  }

  return filteredOrders;
};

export const normalizeOrderbookMapData = (
  data: OrderbookMapCoinsData,
  settings: OrderbookMapSettings,
): OrderbookMapData => {
  const asks: OrderbookMapLimitOrderData[] = [];
  const bids: OrderbookMapLimitOrderData[] = [];
  const defaultSettings: OrderbookMapSettings =
    getOrderbookMapDefaultSettings();
  const ordersDirection: OrderBookMapOrdersDirection =
    settings.ordersDirection ?? defaultSettings.ordersDirection;

  for (const symbol in data) {
    for (const exchange in data[symbol]) {
      try {
        let symbolProcessedAsks = [];
        let symbolProcessedBids = [];

        if (ordersDirection === 'all' || ordersDirection === 'sell') {
          symbolProcessedAsks = processCoinOrders(
            data[symbol][exchange],
            data[symbol][exchange].a,
            exchange as Exchange,
            symbol,
            settings,
          );
        }

        if (ordersDirection === 'all' || ordersDirection === 'buy') {
          symbolProcessedBids = processCoinOrders(
            data[symbol][exchange],
            data[symbol][exchange].b,
            exchange as Exchange,
            symbol,
            settings,
          );
        }

        asks.push(...symbolProcessedAsks);
        bids.push(...symbolProcessedBids);
      } catch (e) {
        console.log(e);
      }
    }
  }
  const ordersSlice =
    ordersDirection === 'all'
      ? Math.round(settings.maxOrdersToShow / 2)
      : settings.maxOrdersToShow;
  return {
    asks: asks.sort(sortOrderBookMapOrders).slice(0, ordersSlice),
    bids: bids.sort(sortOrderBookMapOrders).slice(0, ordersSlice),
  };
};

export const sortOrderBookMapOrders = (
  current: OrderbookMapLimitOrderData,
  prev: OrderbookMapLimitOrderData,
) => prev.corrosion_time - current.corrosion_time;
