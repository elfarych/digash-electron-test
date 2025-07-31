import {OverlayData} from "night-vision/dist/types";
import {defaultDeltaProps, DeltaProps} from "../../models/chart-indicators/Delta";

export const calculateDelta = (props: DeltaProps = defaultDeltaProps, candlesData: number[][]): OverlayData => {
  let result: [timestamp: number, buyVol: number, sellVol: number, total: number, delta: number][] = [];

  for (const tick of candlesData) {
    const price = tick[2];
    const timestamp = tick[0];
    const totalVolume = parseFloat((tick[5] * price).toFixed(0));
    const buyVolume = parseFloat((tick[6] * price).toFixed(0));
    const sellVolume = parseFloat((tick[7] * price).toFixed(0));
    const delta = buyVolume - sellVolume;
    result.push([timestamp, buyVolume, sellVolume, totalVolume, parseFloat(delta.toFixed(0))]);
  }

  return result as unknown as OverlayData;
}
