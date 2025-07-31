export const convertNumber = (value = 0): string | undefined => {
  if (!value) {
    return void 0;
  }

  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return `${formatter.format(value)}`;
};
