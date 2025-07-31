import {Exchange} from "../models/Exchange";

export const exchangeMapper = (exchange: Exchange): Exchange => {
  switch (exchange) {
    case "BINANCE_SPOT":
    case "BINANCE_SPOT_WITH_FUTURES":
    case "BINANCE_SPOT_WITHOUT_FUTURES":
      return "BINANCE_SPOT";
    default:
      return exchange;
  }
}
