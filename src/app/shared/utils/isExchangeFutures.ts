import { Exchange } from '../models/Exchange';

export const isExchangeFutures = (exchange: Exchange): boolean => {
  return exchange.includes('FUTURES');
};
