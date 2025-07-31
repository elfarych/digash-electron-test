import { Exchange } from '../models/Exchange';
import { isExchangeFutures } from "./isExchangeFutures";

export const resolveCoinName = (exchange: Exchange, symbol: string): string => {
  // remove (or add) prfix "1000" for coins (1000PEPEUSDT (futures) -> PEPEUSDT (spot))
  const prefix = "1000";
  if (isExchangeFutures(exchange)) {
    return prefix + symbol;
  } else if (symbol.startsWith(prefix)) {
    return symbol.substring(prefix.length);
  }
  return symbol;
};
