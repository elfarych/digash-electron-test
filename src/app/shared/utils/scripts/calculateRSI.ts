import {defaultRSIProps, RSIProps} from "../../models/chart-indicators/RSI";
import {OverlayData} from "night-vision/dist/types";
import {rsi} from "technicalindicators";

export const calculateRSI = (props: RSIProps = defaultRSIProps, candlesData: number[][]): OverlayData => {
  const values: number[] = candlesData.map(([, open, high, low, close]) => {
    switch (props.source) {
      case "close":
        return close;
      case "open":
        return open;
      case "high":
        return high;
      case "low":
        return low;
    }
  });

  const rsiData = rsi({period: props.length, values});
  let result: [timestamp: number, value: number][] = [];

  for (let i = props.length + 1; i < candlesData.length; i++) {
    result.push([candlesData[i][0], rsiData[i - props.length]]);
  }

  return result as unknown as OverlayData;
}

