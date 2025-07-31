export const calculateDistance = (
  initialPrice: number,
  price: number,
): number => {
  return Math.abs((initialPrice - price) * (100 / initialPrice));
};
