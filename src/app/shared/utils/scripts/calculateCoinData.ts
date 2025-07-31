import { OverlayData } from 'night-vision/dist/types';
import {
  CoinDataProps,
  defaultCoinDataProps,
} from '../../models/chart-indicators/CoinData';
import { CoinData } from '../../models/CoinData';

export const calculateCoinData = (
  props: CoinDataProps = defaultCoinDataProps,
  coinData: CoinData,
): OverlayData => {
  return [coinData] as unknown as OverlayData;
};
