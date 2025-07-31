import {OverlayData} from "night-vision/dist/types";
import {findExtrema} from "../findPeaks";

export const calculateHorizontalLevels = (
  candlesData: number[][],
  touchesToFilter: number = 1,
  threshold: number = 0.5,
  horizontalLevelPeriod: number = 40
): OverlayData => {
  const topLevels = [];
  const bottomLevels = [];
  const timestamps = [];

  for (const [time, open, high, low, close] of candlesData) {
    topLevels.push(high);
    bottomLevels.push(low);
    timestamps.push(time);
  }

  let result: [timestamp: number, value: number, touches: any][] = [];
  const maxima = findExtrema(topLevels, horizontalLevelPeriod, false);
  const minima = findExtrema(bottomLevels, horizontalLevelPeriod, true);

  for (const index of maxima) {
    if (topLevels.slice(index).some(value => value > topLevels[index])) {
      continue
    }

    result.push([timestamps[index], topLevels[index], {touches: 0}]);
  }

  for (const index of minima) {
    if (bottomLevels.slice(index).some(value => value < bottomLevels[index])) {
      continue
    }

    result.push([timestamps[index], bottomLevels[index], {touches: 0}]);
  }

  for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
      const valueI = result[i][1];
      const valueJ = result[j][1];
      const average = (valueI + valueJ) / 2;

      if (Math.abs(valueI - valueJ) <= (threshold / 100) * average) {
        result[i][2].touches += 1;
        result[j][2].touches = result[i][2].touches;
      }
    }
  }

  result = result.filter(([, , {touches}]) => touches >= touchesToFilter);

  return result;
}
