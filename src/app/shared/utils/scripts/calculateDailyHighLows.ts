import {OverlayData} from "night-vision/dist/types";
import {HighLowData} from "../../models/CoinData";

export const calculateDailyHighLows = (data: HighLowData): OverlayData => {
  if (!data) {
    return [];
  }

  return [
    [
      data.low.timestamp,
      data.low.value
    ],
    [
      data.high.timestamp,
      data.high.value
    ]
  ]
}
