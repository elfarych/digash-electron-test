export function getDecimalCount(number: number): number {
  const numberAsString = number.toString();
  if (numberAsString.includes('.')) {
    return numberAsString.split('.')[1].length;
  }
  return 0;
}
