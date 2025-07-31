import {OverlayData} from "night-vision/dist/types";
import {ATRProps, defaultATRProps} from "../../models/chart-indicators/ATR";
import {adl, atr} from "technicalindicators";

export const calculateATR = (props: ATRProps = defaultATRProps, candlesData: number[][], precision: number): OverlayData => {
  const highValues: number[] = [];
  const lowValues: number[] = [];
  const closeValues: number[] = [];

  const data = JSON.parse(JSON.stringify(candlesData));

  data.forEach(([, open, high, low, close, volume]) => {
    highValues.push(high);
    lowValues.push(low);
    closeValues.push(close);
  });

  let result: [timestamp: number, value: number][] = [];

  const ATRData: number[] = atr({
    high: highValues,
    low: lowValues,
    close: closeValues,
    period: props.period
  });

  data.splice(0, props.period ?? defaultATRProps.period);

  for (let i = 0; i < data.length; i++) {
    result.push([data[i][0], parseFloat(ATRData[i]?.toFixed(precision))]);
  }

  return result as unknown as OverlayData;
}
