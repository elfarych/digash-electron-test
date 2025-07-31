function decimalPlaces(number: number): number {
  const numStr = number.toString();
  const decimalIndex = numStr.indexOf('.');
  return decimalIndex !== -1 ? numStr.length - decimalIndex - 1 : 0;
}

function isIntegerNumber(number: number): boolean {
  return Number.isInteger(number);
}

export function detectRoundNumber(
  price: number,
  limitOrderPrice: number,
): boolean {
  const priceDecimalLength = decimalPlaces(price);

  if (priceDecimalLength > 2) {
    const limitOrderDecimalLength = decimalPlaces(limitOrderPrice);
    if (limitOrderDecimalLength === priceDecimalLength - 2) {
      return true;
    }
    return false;
  }

  if (price > 1000) {
    return isIntegerNumber(limitOrderPrice / 1000);
  }

  return isIntegerNumber(limitOrderPrice);
}
