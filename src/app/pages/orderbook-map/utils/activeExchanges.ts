import { OrderbookMapSettings } from './models';

export const getOrderbookMapActiveExchangesList = (
  settings: OrderbookMapSettings,
): string[] => {
  const result: string[] = [];
  for (const key in settings.exchangesSettings) {
    if (settings.exchangesSettings[key]?.active) {
      result.push(key);
    }
  }
  return result;
};
