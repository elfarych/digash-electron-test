export const calculateCandleDistance = (
  open: number,
  close: number,
): number => {
  let distance: number = Math.abs((100 / open) * (close - open));
  if (distance < 0.1) distance = 0.1;
  return distance;
};
