export const convertPrice = (price = 0): string | undefined => {
  if (!price) {
    return void 0;
  }

  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return `${formatter.format(price)}$`;
};

export const convertVolume = (volume = 0) => {
  if (!volume) {
    return void 0;
  }

  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return `${formatter.format(volume)}`;
};
