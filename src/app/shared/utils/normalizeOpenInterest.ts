import { BinanceOpenInterest } from '../models/BinanceOpenInterest';
import { OpenInterest } from '../models/OpenInterest';
import { BybitOpenInterest } from '../models/BybitOpenInterest';

export const normalizeBincanceOpenInterest = (
  data: BinanceOpenInterest[],
): OpenInterest[] => {
  return data.map((value) => ({
    timestamp: value.timestamp,
    value: parseFloat(value.sumOpenInterest),
  }));
};

export const normalizeBybitOpenInterest = (
  data: BybitOpenInterest,
): OpenInterest[] => {
  if (!data?.result) {
    return [];
  }

  return data.result.list.reverse().map((value) => ({
    timestamp: parseInt(value.timestamp),
    value: parseFloat(value.openInterest),
  }));
};
