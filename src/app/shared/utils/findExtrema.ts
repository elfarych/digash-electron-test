export const findExtrema = (data, order, isMinima) => {
  const extrema = [];

  for (let i = order; i < data.length; i++) {
    const window = data.slice(i - order, i + order + 1);

    const isExtrema = window.every((value, index) => {
      if (index === order) return true;
      return isMinima ? data[i] <= value : data[i] >= value;
    });

    if (isExtrema) {
      extrema.push(i);
    }
  }

  return extrema;
};
