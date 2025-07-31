import { ChartSettings } from '../models/ChartSettings';
import { OverlayData } from 'night-vision/dist/types';
import { TrendLevel } from '../models/CoinData';
import { Timeframe } from '../models/Timeframe';

function checkhl(data_back, data_forward, hl) {
  if (hl === 'high' || hl === 'High') {
    const ref = data_back[data_back.length - 1];
    for (let i = 0; i < data_back.length - 1; i++) {
      if (ref < data_back[i]) {
        return 0;
      }
    }
    for (let i = 0; i < data_forward.length; i++) {
      if (ref <= data_forward[i]) {
        return 0;
      }
    }
    return 1;
  }
  if (hl === 'low' || hl === 'Low') {
    const ref = data_back[data_back.length - 1];
    for (let i = 0; i < data_back.length - 1; i++) {
      if (ref > data_back[i]) {
        return 0;
      }
    }
    for (let i = 0; i < data_forward.length; i++) {
      if (ref >= data_forward[i]) {
        return 0;
      }
    }
    return 1;
  }
  return 1;
}

function pivot(osc, LBL, LBR, highlow) {
  const left = [];
  const right = [];
  const pivots = Array(osc.length).fill(0.0);

  for (let i = 0; i < osc.length; i++) {
    if (i < LBL + 1) {
      left.push(osc[i]);
    }
    if (i > LBL) {
      right.push(osc[i]);
    }
    if (i > LBL + LBR) {
      left.push(right[0]);
      left.shift();
      right.shift();
      if (checkhl(left, right, highlow)) {
        pivots[i - LBR] = osc[i - LBR];
      }
    }
  }

  return pivots;
}

function findExtremums(data, period, type) {
  const extremums = Array(data.length).fill(0);

  for (let i = period; i < data.length - 1; i++) {
    const left = data.slice(i - period, i);
    const right = data.slice(i + 1, i + 1 + period);

    if (type === 'high' && isHigh(data[i], left, right)) {
      extremums[i] = data[i];
    } else if (type === 'low' && isLow(data[i], left, right)) {
      extremums[i] = data[i];
    }
  }

  return extremums;
}

function isHigh(value, left, right) {
  return left.every((v) => value > v) && right.every((v) => value > v);
}

function isLow(value, left, right) {
  return left.every((v) => value < v) && right.every((v) => value < v);
}

const getThresholdByTimeframe = (timeframe): number => {
  switch (timeframe) {
    case '1m':
      return 0.05;
    case '5m':
      return 0.075;
    case '15m':
      return 0.1;
    case '1h':
      return 0.2;
    case '4h':
      return 0.4;
    case '1d':
      return 0.6;
  }
  return 0;
};

const checkIfTrendLevelIsValid = (
  trendLevels: { price: number; index: number }[],
  data: number[][],
  timeframe: Timeframe,
  type: 'low' | 'high',
): number => {
  let hline = 0;

  const firstPoint = trendLevels[0];
  const secondPoint = trendLevels[1];
  const thrdPoint = trendLevels[2];

  if (type === 'low') {
    if (
      firstPoint.price > secondPoint.price ||
      secondPoint.price > thrdPoint.price
    ) {
      return 0;
    }
    let touchedWithSecondPoint: boolean = false;

    const diff =
      (firstPoint.price - thrdPoint.price) /
      (firstPoint.index - thrdPoint.index);
    hline = firstPoint.price + diff;
    for (let x = firstPoint.index + 1; x <= data.length - 1; x++) {
      const threshold = (data[x][3] / 100) * getThresholdByTimeframe(timeframe);
      if (data[x][3] - hline < -threshold) {
        return 0;
      }

      if (
        x === secondPoint.index &&
        Math.abs(secondPoint.price - hline) < threshold
      ) {
        touchedWithSecondPoint = true;
      }

      hline += diff;
    }

    if (!touchedWithSecondPoint) {
      return 0;
    }
  }

  if (type === 'high') {
    if (
      firstPoint.price < secondPoint.price ||
      secondPoint.price < thrdPoint.price
    ) {
      return 0;
    }
    let touchedWithSecondPoint: boolean = false;

    const diff =
      (firstPoint.price - thrdPoint.price) /
      (firstPoint.index - thrdPoint.index);
    hline = firstPoint.price + diff;
    for (let x = firstPoint.index + 1; x <= data.length - 1; x++) {
      const threshold = (data[x][2] / 100) * getThresholdByTimeframe(timeframe);
      if (hline - data[x][2] < -threshold) {
        return 0;
      }

      if (
        x === secondPoint.index &&
        Math.abs(secondPoint.price - hline) < threshold
      ) {
        touchedWithSecondPoint = true;
      }

      hline += diff;
    }

    if (!touchedWithSecondPoint) {
      return 0;
    }
  }

  return hline;
};

const calculateCandlesTrendLines = (
  data: number[][],
  chartSettings: ChartSettings,
): OverlayData => {
  const prd = chartSettings.trendlinesPeriod ?? 20;
  const PPnum = 3;

  const result = [];

  const low = data.map((value) => value[3]);
  const high = data.map((value) => value[2]);

  const ph = findExtremums(high, prd, 'high');
  const pl = findExtremums(low, prd, 'low');

  const trendLevels = [];

  // low
  for (let bar_index = 0; bar_index < data.length; bar_index++) {
    const currentLow = pl[bar_index];
    if (currentLow === 0) {
      continue;
    }

    const possibleTrendLevels = [{ price: currentLow, index: bar_index }];

    for (let i = bar_index + 1; i < data.length; i++) {
      const low = pl[i];
      const lowPos = i;

      if (!low) {
        continue;
      }

      possibleTrendLevels.push({ price: low, index: lowPos });

      if (possibleTrendLevels.length >= PPnum) {
        for (let j = 1; j < possibleTrendLevels.length - 1; j++) {
          for (let k = j + 1; k < possibleTrendLevels.length; k++) {
            const trendCandidate = [
              possibleTrendLevels[0],
              possibleTrendLevels[j],
              possibleTrendLevels[k],
            ];

            const hline = checkIfTrendLevelIsValid(
              trendCandidate,
              data,
              chartSettings.timeframe,
              'low',
            );
            if (hline) {
              trendCandidate[2].price = hline;
              trendLevels.push(trendCandidate);
            }
          }
        }
      }
    }
  }

  // high
  for (let bar_index = 0; bar_index < data.length; bar_index++) {
    const currentHigh = ph[bar_index];
    if (currentHigh === 0) {
      continue;
    }

    const possibleTrendLevels = [{ price: currentHigh, index: bar_index }];

    for (let i = bar_index + 1; i < data.length; i++) {
      const high = ph[i];
      const highPos = i;

      if (!high) {
        continue;
      }

      possibleTrendLevels.push({ price: high, index: highPos });

      if (possibleTrendLevels.length >= PPnum) {
        for (let j = 1; j < possibleTrendLevels.length - 1; j++) {
          for (let k = j + 1; k < possibleTrendLevels.length; k++) {
            const trendCandidate = [
              possibleTrendLevels[0],
              possibleTrendLevels[j],
              possibleTrendLevels[k],
            ];

            const hline = checkIfTrendLevelIsValid(
              trendCandidate,
              data,
              chartSettings.timeframe,
              'high',
            );
            if (hline) {
              trendCandidate[2].price = hline;
              trendLevels.push(trendCandidate);
            }
          }
        }
      }
    }
  }

  const timestamps = [];
  for (const trendLevel of trendLevels) {
    const fstPoint = trendLevel[0];
    const scndPoint = trendLevel[1];
    const lastPoint = trendLevel[trendLevel.length - 1];

    const intersection =
      timestamps.includes(data[fstPoint.index][0]) ||
      timestamps.includes(data[scndPoint.index][0]) ||
      timestamps.includes(data[lastPoint.index][0]);

    if (!intersection) {
      result.push([
        [data[fstPoint.index][0], fstPoint.price],
        [data[data.length - 1][0], lastPoint.price],
      ]);

      timestamps.push(data[fstPoint.index][0]);
      timestamps.push(data[scndPoint.index][0]);
      timestamps.push(data[lastPoint.index][0]);
    }
  }

  return result;
};

export const calculateTrendLines = (
  data: number[][],
  chartSettings: ChartSettings,
  useBackendLevels = false,
  serverLevels: { [key: string]: TrendLevel[] } = {},
): OverlayData => {
  if (useBackendLevels) {
    return serverLevels[chartSettings.timeframe];
  }

  return calculateCandlesTrendLines(data, chartSettings);
};
