import {
  DepthMapCoinsData,
  DepthMapData,
  DepthMapDataOrderBlock,
  DepthMapOrderFilterValues,
  DepthMapSettings,
  getEmptyDepthMapData,
  getEmptyDepthMapDataBlocks,
  LimitOrderDepthMapData,
} from './models';
import { CoinData } from '../../../shared/models/CoinData';
import { Exchange } from '../../../shared/models/Exchange';
import { LimitOrderData } from '../../../shared/models/LimitOrderData';
import {
  DEPTH_MAP_DISTANT_BLOCK_MAX_DISTANCE,
  DEPTH_MAP_NEAR_BLOCK_MAX_DISTANCE,
} from './constants';

const priceChangeIntervalsKayMap = {
  '1m': 'priceChange1m',
  '3m': 'priceChange3m',
  '5m': 'priceChange5m',
  '15m': 'priceChange15m',
  '30m': 'priceChange30m',
  '1h': 'priceChange1h',
  '2h': 'priceChange2h',
  '6h': 'priceChange6h',
  '12h': 'priceChange12h',
  '24h': ' priceChange24h',
};

const volumeSumIntervalsKeyMap = {
  '1m': 'volume_sum_1m',
  '3m': 'volume_sum_3m',
  '5m': 'volume_sum_5m',
  '15m': 'volume_sum_15m',
  '30m': 'volume_sum_30m',
  '1h': 'volume_sum_1h',
  '2h': 'volume_sum_2h',
  '6h': 'volume_sum_6h',
  '12h': 'volume_sum_12h',
  '24h': ' volume_sum_24h',
};

const isCoinDataWithinFilter = (
  coinData: CoinData,
  settings: DepthMapSettings,
  exchange: string,
  symbol: string,
): boolean => {
  const exchangeSettings = settings.exchangesSettings[exchange];

  if (settings.blacklist.includes(symbol)) return false;

  if (!coinData.volume_data || !coinData.price_changes) return false;

  const coinVolume =
    coinData.volume_data[
      volumeSumIntervalsKeyMap[exchangeSettings.volumeFilterPeriod]
    ];
  const coinPriceChange = Math.abs(
    coinData.price_changes[
      priceChangeIntervalsKayMap[exchangeSettings.priceChangeFilterPeriod]
    ],
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

const formatOrder = (
  order: LimitOrderData,
  symbol: string,
  exchange: Exchange,
): LimitOrderDepthMapData => {
  return { ...order, symbol, exchange };
};

const groupOrders = (
  orders: LimitOrderData[],
  settings: DepthMapSettings,
  exchange: string,
  symbol: string,
): DepthMapDataOrderBlock => {
  const result: DepthMapDataOrderBlock = getEmptyDepthMapDataBlocks();

  const exchangeSettings = settings.exchangesSettings[exchange];

  const filterOrder = (
    order: LimitOrderData,
    filters: DepthMapOrderFilterValues,
    block: string,
  ): boolean => {
    if (
      order.corrosion_time >= filters.minCorrosionTime &&
      (!filters.filterByOrderSum || order.full_price >= filters.minOrderSum)
    ) {
      const formattedOrder = formatOrder(order, symbol, exchange as Exchange);
      if (
        order.distance >= DEPTH_MAP_NEAR_BLOCK_MAX_DISTANCE &&
        order.distance <= DEPTH_MAP_DISTANT_BLOCK_MAX_DISTANCE
      ) {
        result.distantBlock[block].push(formattedOrder);
      } else if (order.distance < DEPTH_MAP_NEAR_BLOCK_MAX_DISTANCE) {
        result.nearBlock[block].push(formattedOrder);
      }
      return true;
    }
    return false;
  };

  for (const order of orders) {
    if (filterOrder(order, exchangeSettings.largeOrderFilterValues, 'large'))
      continue;
    if (filterOrder(order, exchangeSettings.mediumOrderFilterValues, 'medium'))
      continue;
    if (filterOrder(order, exchangeSettings.smallOrderFilterValues, 'small'))
      continue;
  }

  return result;
};

const mergeOrderBlocks = (
  target: DepthMapDataOrderBlock,
  source: DepthMapDataOrderBlock,
) => {
  target.nearBlock.small.push(...source.nearBlock.small);
  target.nearBlock.medium.push(...source.nearBlock.medium);
  target.nearBlock.large.push(...source.nearBlock.large);
  target.distantBlock.small.push(...source.distantBlock.small);
  target.distantBlock.medium.push(...source.distantBlock.medium);
  target.distantBlock.large.push(...source.distantBlock.large);
};

const sortAndSlice = (
  orders: LimitOrderDepthMapData[],
  settings: DepthMapSettings,
): LimitOrderDepthMapData[] => {
  return orders
    .sort((current, prev) => prev.corrosion_time - current.corrosion_time)
    .slice(0, settings.maxOrdersInColumn);
};

const processBlocks = (
  blocks: DepthMapDataOrderBlock,
  settings: DepthMapSettings,
): void => {
  ['small', 'medium', 'large'].forEach((size) => {
    blocks.nearBlock[size] = sortAndSlice(blocks.nearBlock[size], settings);
    blocks.distantBlock[size] = sortAndSlice(
      blocks.distantBlock[size],
      settings,
    );
  });
};

export const normalizeDepthMapData = (
  data: DepthMapCoinsData,
  settings: DepthMapSettings,
): DepthMapData => {
  const result: DepthMapData = getEmptyDepthMapData();
  for (const symbol in data) {
    if (!data[symbol]) continue;

    for (const exchange in data[symbol]) {
      const coinData: CoinData = data[symbol][exchange];
      if (!coinData) continue;

      if (isCoinDataWithinFilter(coinData, settings, exchange, symbol)) {
        const groupedAsks: DepthMapDataOrderBlock = groupOrders(
          coinData.a,
          settings,
          exchange as Exchange,
          symbol,
        );

        const groupedBids: DepthMapDataOrderBlock = groupOrders(
          coinData.b,
          settings,
          exchange as Exchange,
          symbol,
        );

        mergeOrderBlocks(result.asks, groupedAsks);
        mergeOrderBlocks(result.bids, groupedBids);
      }
    }
  }

  processBlocks(result.asks, settings);
  processBlocks(result.bids, settings);

  return result;
};
