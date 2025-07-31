export const getLinesDataFromCandles = (
  candlesData: number[][],
): [number, number][] => {
  return candlesData.map(([openTime, open, high, low, close, volume]) => {
    return [openTime, close];
  });
};
