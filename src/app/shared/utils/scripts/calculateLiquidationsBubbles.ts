import { OverlayData } from 'night-vision/dist/types';
import { LiquidationsBubblesProps } from '../../models/chart-indicators/LiquidationsBubbles';
import { Liquidation } from '../Liquidation';
import { CoinData } from '../../models/CoinData';

export const calculateLiquidationsBubbles = (
  props: LiquidationsBubblesProps,
  volumeData: CoinData['volume_data'],
  liquidationsData: { [tick: string]: Liquidation },
  precision: number,
): OverlayData => {
  const result: OverlayData = [];

  if (!liquidationsData) {
    return result;
  }

  const avgVolume = volumeData?.volume_avg_2h ?? 100_000;

  const sortedEntries = Object.entries(liquidationsData)
    .sort(([, a], [, b]) => b.price * b.quantity - a.price * a.quantity)
    .slice(0, 25);

  for (const [key, value] of sortedEntries) {
    result.push([
      parseInt(key),
      {
        ...value,
        price: parseFloat(value.price.toFixed(precision)),
        avgVolume,
      },
    ]);
  }

  return result;
};
