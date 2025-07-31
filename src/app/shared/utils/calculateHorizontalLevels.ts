import { ChartSettings } from '../models/ChartSettings';
import { Timeframe } from '../models/Timeframe';
import { findExtrema } from './findExtrema';
import { CoinData } from '../models/CoinData';
import { getMultiTimeframes } from './getMultiTimeframes';

type ChartLevel = [number, number, { touches: number }, Timeframe];

const getDifferenceInMinutes = (customTimestamp): number => {
  const currentTimestamp = Date.now();
  const differenceInMilliseconds = currentTimestamp - customTimestamp;
  return Math.floor(differenceInMilliseconds / (1000 * 60));
};

const calculateCandlesHorizontalLevels = (
  candlesData: number[][],
  threshold = 0.5,
  period = 20,
  timeframe: Timeframe,
): ChartLevel[] => {
  const topLevels = [];
  const bottomLevels = [];
  const timestamps = [];

  for (const [time, open, high, low, close] of candlesData) {
    topLevels.push(high);
    bottomLevels.push(low);
    timestamps.push(time);
  }

  const result: ChartLevel[] = [];
  const maxima = findExtrema(topLevels, period, false);
  const minima = findExtrema(bottomLevels, period, true);

  for (const index of maxima) {
    if (topLevels.slice(index).some((value) => value > topLevels[index])) {
      continue;
    }

    // result.push({time: timestamps[index] * 1000, value: topLevels[index], touches: 0, top: true});
    result.push([
      timestamps[index],
      topLevels[index],
      { touches: 0 },
      timeframe,
    ]);
  }

  for (const index of minima) {
    if (
      bottomLevels.slice(index).some((value) => value < bottomLevels[index])
    ) {
      continue;
    }

    // result.push({time: timestamps[index] * 1000, value: bottomLevels[index], touches: 0, top: false});
    result.push([
      timestamps[index],
      bottomLevels[index],
      { touches: 0 },
      timeframe,
    ]);
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

  return result;
};

const calculateBackendHorizontalLevels = (
  serverHorizontalLevels: ChartLevel[],
  timeframe: Timeframe,
): ChartLevel[] => {
  return serverHorizontalLevels.map((l) => [l[0], l[1], l[2], timeframe]);
};

export const calculateHorizontalLevels = (
  candlesData: number[][],
  chartSettings: ChartSettings,
  coinData: CoinData,
  roundLevels = false,
  currentPrice = 0,
): ChartLevel[] => {
  let result: ChartLevel[] = [];
  if (coinData.use_backend_levels) {
    const levels: ChartLevel[] =
      coinData.horizontal_levels[chartSettings.timeframe];
    result = calculateBackendHorizontalLevels(levels, chartSettings.timeframe);
  } else {
    result = calculateCandlesHorizontalLevels(
      candlesData,
      chartSettings.horizontalLevelsTouchesThreshold,
      chartSettings.horizontalLevelsPeriod,
      chartSettings.timeframe,
    );
  }

  const availableTimeframes = getMultiTimeframes(chartSettings.timeframe);

  if (chartSettings.horizontalLevelsTimeframes?.length) {
    chartSettings.horizontalLevelsTimeframes.forEach((t) => {
      if (availableTimeframes.includes(t)) {
        result = [
          ...result,
          ...calculateBackendHorizontalLevels(
            coinData.horizontal_levels[t] ?? [],
            t,
          ),
        ];
      }
    });
  }

  result.reverse();

  const levelsObj: { [key: string]: boolean } = {};
  const filteredResult: ChartLevel[] = [];

  result.forEach((l) => {
    const key = `${l[1]}`;

    if (!levelsObj[key]) {
      levelsObj[key] = true;
      filteredResult.push(l);
    }
  });

  return (
    filteredResult
      // .filter(([, levelPrice]) =>
      //   roundLevels ? detectRoundNumber(currentPrice, levelPrice) : true,
      // )
      .filter(
        ([, , { touches }]) => touches >= chartSettings.horizontalLevelsTouches,
      )
      .filter(
        ([timestamp]) =>
          getDifferenceInMinutes(timestamp) >
          chartSettings.horizontalLevelsLivingTime * 60,
      )
  );
};
