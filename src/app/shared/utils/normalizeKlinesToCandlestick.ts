import {
  CandlestickBinance,
  CandlestickBitget,
  CandlestickBybit,
  CandlestickCommon,
  CandlestickGateFutures,
  CandlestickGateSpot,
  CandlestickOkx,
  CandlestickVisualization,
} from '../models/Candlestick';
import { timeToLocal } from './timeToLocal';

export const normalizeBinanceKlinesToCandlestick = (
  data: CandlestickBinance[],
): CandlestickVisualization[] => {
  return data.map(
    ([
      openTime,
      open,
      high,
      low,
      close,
      volume,
      closeTime,
      q,
      trades,
      takerVolume,
    ]) => {
      const time: number = openTime / 1000;
      return {
        time: timeToLocal(time),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
        buyVolume: parseFloat(takerVolume),
        sellVolume: parseFloat(volume) - parseFloat(takerVolume),
        newCandle: true,
      };
    },
  );
};

export const normalizeCommonKlinesToCandlestick = (
  data: CandlestickCommon[],
): CandlestickVisualization[] => {
  return data.map(
    ([
      openTime,
      open,
      high,
      low,
      close,
      volume,
      closeTime,
      q,
      trades,
      takerVolume,
    ]) => {
      const time: number = openTime / 1000;
      return {
        time: timeToLocal(time),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
        buyVolume: parseFloat(takerVolume),
        sellVolume: parseFloat(volume) - parseFloat(takerVolume),
        newCandle: true,
      };
    },
  );
};

export const normalizeBybitKlinesToCandlestick = (
  data: CandlestickBybit,
): CandlestickVisualization[] => {
  return data.result.list
    .map(([openTime, open, high, low, close, volume]) => {
      const time: number = parseInt(openTime) / 1000;
      return {
        time: timeToLocal(time),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
        buyVolume: 0,
        sellVolume: 0,
        newCandle: true,
      };
    })
    .reverse();
};

export const normalizeBitgetKlinesToCandlestick = (
  data: CandlestickBitget,
): CandlestickVisualization[] => {
  return (
    data.data?.map(([openTime, open, high, low, close, volume]) => {
      const time: number = parseInt(openTime) / 1000;
      return {
        time: timeToLocal(time),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
        buyVolume: 0,
        sellVolume: 0,
        newCandle: true,
      };
    }) ?? []
  );
};

export const normalizeOkxKlinesToCandlestick = (
  data: CandlestickOkx,
): CandlestickVisualization[] => {
  return data.data
    .map(([openTime, open, high, low, close, volume]) => {
      const time: number = parseInt(openTime) / 1000;
      return {
        time,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume) * parseFloat(close),
        buyVolume: 0,
        sellVolume: 0,
        newCandle: true,
      };
    })
    .reverse();
};

export const normalizeGateSpotKlinesToCandlestick = (
  data: CandlestickGateSpot[],
): CandlestickVisualization[] => {
  return data.map((i) => {
    const [time, quoteVolume, close, high, low, open, volume] = i;
    return {
      time: parseInt(time),
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume: parseFloat(volume),
      buyVolume: 0,
      sellVolume: 0,
      newCandle: true,
    };
  });
};

export const normalizeGateFuturesKlinesToCandlestick = (
  data: CandlestickGateFutures[],
): CandlestickVisualization[] => {
  return data.map((i) => {
    return {
      time: i.t,
      open: parseFloat(i.o),
      high: parseFloat(i.h),
      low: parseFloat(i.l),
      close: parseFloat(i.c),
      volume: i.v,
      buyVolume: 0,
      sellVolume: 0,
      newCandle: true,
    };
  });
};
