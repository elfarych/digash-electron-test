import { ChartSettings } from '../models/ChartSettings';
import { OverlayData } from 'night-vision/dist/types';
import { TrendLevel } from '../models/CoinData';

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
} // Функция для вычисления среднего диапазона

function calculateAverageRange(
  data: number[][],
  index: number,
  period: number,
): number {
  const startIndex = Math.max(0, index - period + 1); // Индекс начала выборки
  const rangeSum = data
    .slice(startIndex, index + 1)
    .reduce((sum, candle) => sum + (candle[2] - candle[3]), 0); // Сумма разности High - Low
  return rangeSum / Math.min(period, index + 1); // Среднее значение размаха
}

export const calculateCandlesTrendLines = (
  data: number[][],
  chartSettings: ChartSettings,
): OverlayData => {
  const trendlinesPeriod = chartSettings.trendlinesPeriod; // Период для поиска трендовых линий
  const pivotPointsCount = 3; // Количество пивотных точек для тренда

  // Настройки погрешности
  const averagePeriod = 100; // Количество свечей для расчета среднего значения
  const baseToleranceFactor = 3; // Фактор, влияющий на погрешность

  const topValues = new Array(pivotPointsCount).fill(0); // Значения пиков
  const topPositions = new Array(pivotPointsCount).fill(0); // Позиции пиков
  const bottomValues = new Array(pivotPointsCount).fill(0); // Значения низов
  const bottomPositions = new Array(pivotPointsCount).fill(0); // Позиции низов

  const trendLines: OverlayData = []; // Массив для хранения трендовых линий

  const lows = data.map((value) => value[3]); // Минимальные значения свечей
  const highs = data.map((value) => value[2]); // Максимальные значения свечей

  const pivotHighs = pivot(highs, trendlinesPeriod, trendlinesPeriod, 'high'); // Пивоты для максимумов
  const pivotLows = pivot(lows, trendlinesPeriod, trendlinesPeriod, 'low'); // Пивоты для минимумов

  let previousUptrendValue1 = 0;
  let previousUptrendValue2 = 0;
  let previousDowntrendValue1 = 0;
  let previousDowntrendValue2 = 0;

  for (let currentIndex = 0; currentIndex < data.length; currentIndex++) {
    // Игнорируем свечи без значимых пивотов
    if (pivotHighs[currentIndex] === 0 && pivotLows[currentIndex] === 0) {
      continue;
    }

    // Вычисляем средний диапазон за указанный период
    const averageRange = calculateAverageRange(
      data,
      currentIndex,
      averagePeriod,
    );

    let uptrendLinesCount = 0; // Счетчик восходящих линий
    let downtrendLinesCount = 0; // Счетчик нисходящих линий

    let currentLow = 0; // Текущий минимум
    let currentLowPosition = 0; // Позиция минимума

    for (
      let i = currentIndex - trendlinesPeriod;
      i <= currentIndex + trendlinesPeriod;
      i++
    ) {
      if (pivotLows[i] > 0) {
        currentLow = pivotLows[i];
        currentLowPosition = i;
      }
    }

    let currentHigh = 0; // Текущий максимум
    let currentHighPosition = 0; // Позиция максимума

    for (
      let i = currentIndex - trendlinesPeriod;
      i <= currentIndex + trendlinesPeriod;
      i++
    ) {
      if (pivotHighs[i] > 0) {
        currentHigh = pivotHighs[i];
        currentHighPosition = i;
      }
    }

    // Обновляем массивы минимумов и максимумов
    if (currentLow && currentLowPosition !== bottomPositions[0]) {
      bottomValues.unshift(currentLow);
      bottomPositions.unshift(currentLowPosition);
      bottomPositions.pop();
      bottomValues.pop();
    }

    if (currentHighPosition !== topPositions[0]) {
      topValues.unshift(currentHigh);
      topPositions.unshift(currentHighPosition);
      topPositions.pop();
      topValues.pop();
    }

    if (bottomPositions.some((value) => value === 0)) {
      continue;
    }

    if (topPositions.some((value) => value === 0)) {
      continue;
    }

    // Расчет трендовых линий
    for (
      let firstPointIndex = 0;
      firstPointIndex < pivotPointsCount - 2;
      firstPointIndex++
    ) {
      let upperValue1 = 0.0;
      let upperValue2 = 0.0;
      let upperPosition1 = 0;
      let upperPosition2 = 0;

      if (uptrendLinesCount < 3) {
        for (
          let secondPointIndex = pivotPointsCount - 1;
          secondPointIndex > firstPointIndex;
          secondPointIndex--
        ) {
          const firstValue = bottomValues[firstPointIndex];
          const secondValue = bottomValues[secondPointIndex];
          const firstPosition = bottomPositions[firstPointIndex];
          const secondPosition = bottomPositions[secondPointIndex];

          if (secondPosition === 0 || firstPosition === 0) {
            continue;
          }

          if (firstValue > secondValue) {
            const valueDifference =
              (firstValue - secondValue) / (firstPosition - secondPosition);
            let highLine = secondValue + valueDifference;
            let lastIndex = currentIndex;
            let isValidLine = true;

            for (let x = secondPosition + 1; x <= data.length - 1; x++) {
              if (chartSettings.trendlinesSource === 'high/low') {
                if (
                  data[x][3] <
                  highLine - averageRange * baseToleranceFactor
                ) {
                  isValidLine = false;
                  break;
                }
              } else {
                if (
                  data[x][4] <
                  highLine - averageRange * baseToleranceFactor
                ) {
                  isValidLine = false;
                  break;
                }
              }

              lastIndex = x;
              highLine += valueDifference;
            }

            if (isValidLine) {
              upperValue1 = highLine - valueDifference;
              upperValue2 = secondValue;
              upperPosition1 = lastIndex;
              upperPosition2 = secondPosition;
              break;
            }
          }
        }
      }

      let lowerValue1 = 0;
      let lowerValue2 = 0;
      let lowerPosition1 = 0;
      let lowerPosition2 = 0;

      if (downtrendLinesCount < 3) {
        for (
          let secondPointIndex = pivotPointsCount - 1;
          secondPointIndex > firstPointIndex;
          secondPointIndex--
        ) {
          const firstValue = topValues[firstPointIndex];
          const secondValue = topValues[secondPointIndex];
          const firstPosition = topPositions[firstPointIndex];
          const secondPosition = topPositions[secondPointIndex];

          if (secondPosition === 0 || firstPosition === 0) {
            continue;
          }

          if (firstValue < secondValue) {
            const valueDifference =
              (secondValue - firstValue) / (firstPosition - secondPosition);
            let lowLine = secondValue - valueDifference;
            let lastIndex = currentIndex;
            let isValidLine = true;

            for (let x = secondPosition + 1; x <= data.length - 1; x++) {
              if (chartSettings.trendlinesSource === 'high/low') {
                if (data[x][2] > lowLine + averageRange * baseToleranceFactor) {
                  isValidLine = false;
                  break;
                }
              } else {
                if (data[x][4] > lowLine + averageRange * baseToleranceFactor) {
                  isValidLine = false;
                  break;
                }
              }

              lastIndex = x;
              lowLine -= valueDifference;
            }

            if (isValidLine) {
              lowerValue1 = lowLine + valueDifference;
              lowerValue2 = secondValue;
              lowerPosition1 = lastIndex;
              lowerPosition2 = secondPosition;
              break;
            }
          }
        }
      }

      if (
        upperPosition1 !== 0 &&
        upperPosition2 !== 0 &&
        uptrendLinesCount < 3 &&
        previousUptrendValue1 !== upperValue1 &&
        previousUptrendValue2 !== upperValue2
      ) {
        uptrendLinesCount++;
        trendLines.push([
          [data[upperPosition2][0], upperValue2],
          [data[upperPosition1][0], upperValue1],
        ]);
        previousUptrendValue1 = upperValue1;
        previousUptrendValue2 = upperValue2;
      }

      if (
        lowerPosition1 !== 0 &&
        lowerPosition2 !== 0 &&
        downtrendLinesCount < 3 &&
        previousDowntrendValue1 !== lowerValue1 &&
        previousDowntrendValue2 !== lowerValue2
      ) {
        downtrendLinesCount++;
        trendLines.push([
          [data[lowerPosition2][0], lowerValue2],
          [data[lowerPosition1][0], lowerValue1],
        ]);
        previousDowntrendValue1 = lowerValue1;
        previousDowntrendValue2 = lowerValue2;
      }
    }
  }

  return trendLines;
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
