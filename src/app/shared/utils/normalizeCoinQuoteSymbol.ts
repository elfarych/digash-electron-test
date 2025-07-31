export const normalizeCoinQuoteSymbol = (symbol: string): string => {
  return symbol
    .replace('-USDT-SWAP', '')
    .replace('-USDT', '')
    .replace('_USDT', '')
    .replace('USDT', '');
};
