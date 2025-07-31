import { OverlayData } from 'night-vision/dist/types';
import { defaultOIProps, OIProps } from '../../models/chart-indicators/OI';
import { OpenInterest } from '../../models/OpenInterest';

export const calculateOI = (
  props: OIProps = defaultOIProps,
  candlesData: number[][],
  openInterestData: OpenInterest[],
): OverlayData => {
  if (!openInterestData?.length) {
    return [];
  }

  const result: [timestamp: number, value: number][] = [];

  const diff = candlesData.length - openInterestData.length;

  for (let i = openInterestData.length - 1; i >= 0; i--) {
    const value: number = openInterestData[i].value;
    if (candlesData[i + diff]) result.unshift([candlesData[i + diff][0], value]);
  }

  return result as unknown as OverlayData;
};
