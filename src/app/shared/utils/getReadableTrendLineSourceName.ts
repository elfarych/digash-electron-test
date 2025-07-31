export const getReadableTrendLineSourceName = (
  type: 'high/low' | 'close',
): string => {
  switch (type) {
    case 'high/low':
      return 'Хай/Лой';
    case 'close':
      return 'Закрытие';
  }

  return 'Закрытие';
};
