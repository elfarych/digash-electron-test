export const getCloseOrOpenColor = (
  open: number,
  close: number,
  opacity = 1,
): string => {
  return close >= open
    ? `rgba(38, 166, 154, ${opacity})`
    : `rgba(239, 83, 80, ${opacity})`;
};
