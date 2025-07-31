export const getNatrTooltip = (period: string): string => {
  if (period.endsWith('m') || period.endsWith('1h')) {
    return 'NATR для данного периода расчитывается по минутным свечам';
  }

  return 'NATR для данного периода расчитывается по часовым свечам';
};
