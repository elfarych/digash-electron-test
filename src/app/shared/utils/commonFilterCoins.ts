import { ChartSettings } from '../models/ChartSettings';
import { CoinData } from '../models/CoinData';
import {
  correlationIntervalsKeyMap,
  priceChangeIntervalsKayMap,
  tradesIntervalsKeyMap,
  volumeSumIntervalsKeyMap,
} from './intervalMaps';

export const commonCheckCoinByFilters = (
  symbol: string,
  coinData: CoinData,
  filters: ChartSettings,
): boolean => {
  if (filters.blacklist?.includes(symbol)) {
    return false;
  }
  if (!coinData.volume_data || !coinData.correlation_data) return false;

  const volumeInterval = filters?.volumeInterval ?? 'interval_24h';
  const correlationInterval = filters?.correlationInterval ?? 'interval_24h';
  const priceChangeInterval = filters?.priceChangeInterval ?? 'interval_24h';
  const tradesInterval = filters?.tradesInterval ?? 'interval_24h';

  const volume =
    coinData.volume_data[
      volumeSumIntervalsKeyMap[volumeInterval.replace('interval_', '')]
    ] ?? 0;

  const correlation =
    (coinData.correlation_data?.[
      correlationIntervalsKeyMap?.[correlationInterval.replace('interval_', '')]
    ] ?? 0) * 100;

  const priceChange =
    coinData.price_changes?.[
      priceChangeIntervalsKayMap?.[priceChangeInterval.replace('interval_', '')]
    ] ?? 0;

  const trades =
    coinData.trades_data[
      tradesIntervalsKeyMap[tradesInterval.replace('interval_', '')]
    ] ?? 0;

  const volumeFromCondition: boolean = volume >= (filters.volumeFrom ?? 0);
  const volumeToCondition: boolean =
    volume <= (filters.volumeTo ?? 100000000000000);

  const correlationFromCondition: boolean =
    correlation >= (filters.correlationFrom ?? -100);
  const correlationToCondition: boolean =
    correlation <= (filters.correlationTo ?? 100);

  let tradesFromCondition: boolean = true;
  let tradesToCondition: boolean = true;

  if (filters.tradesFrom && trades > 5) {
    tradesFromCondition = filters.tradesFrom <= trades;
  }

  if (filters.tradesTo && trades > 5) {
    tradesToCondition = filters.tradesTo >= trades;
  }

  let priceChangeFromCondition: boolean =
    priceChange >= (filters.priceChangeFrom ?? -100);
  let priceChangeToCondition: boolean =
    priceChange <= (filters.priceChangeTo ?? 1000);

  // note: fix conflict with old settings
  if (filters.priceChangeFrom === 0 && filters.priceChangeTo === 10_000) {
    priceChangeFromCondition = true;
    priceChangeToCondition = true;
  }

  if (filters.priceChangeFrom === 0 && filters.priceChangeTo === 100) {
    priceChangeFromCondition = true;
    priceChangeToCondition = true;
  }

  if (filters.priceChangeFrom === 0 && filters.priceChangeTo === 0) {
    priceChangeFromCondition = true;
    priceChangeToCondition = true;
  }

  return (
    volumeToCondition &&
    volumeFromCondition &&
    correlationFromCondition &&
    correlationToCondition &&
    priceChangeFromCondition &&
    priceChangeToCondition &&
    tradesToCondition &&
    tradesFromCondition
  );
};
