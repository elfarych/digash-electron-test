import { Exchange } from '../models/Exchange';

export const getExchangeOpenInterestAPI = (exchange: Exchange): string => {
  switch (exchange) {
    case 'BINANCE_SPOT':
    case 'BINANCE_SPOT_WITHOUT_FUTURES':
    case 'BYBIT_SPOT':
    case 'BINANCE_FUTURES':
      return 'https://fapi.binance.com/futures/data';
    case 'BYBIT_FUTURES':
      return 'https://api.bybit.com/v5/market';
  }

  return '';
};

export const getExchangeAPI = (exchange: Exchange): string => {
  switch (exchange) {
    case 'BINANCE_SPOT':
    case 'BINANCE_SPOT_WITHOUT_FUTURES':
    case 'BINANCE_SPOT_WITH_FUTURES':
      return 'https://api.binance.com/api/v3';
    case 'BINANCE_FUTURES':
      return 'https://fapi.binance.com/fapi/v1';
    case 'BYBIT_SPOT':
    case 'BYBIT_FUTURES':
      return 'https://api.bybit.com/v5/market';
    case 'OKX_SPOT':
    case 'OKX_FUTURES':
      return 'https://www.okx.com';

    case 'GATE_FUTURES':
      return 'https://api.gateio.ws/api/v4/futures/usdt';
    case 'GATE_SPOT':
      return 'https://api.gateio.ws/api/v4/spot';
  }

  return '';
};

export const getExchangeWS = (exchange: Exchange): string => {
  switch (exchange) {
    case 'BINANCE_SPOT':
    case 'BINANCE_SPOT_WITHOUT_FUTURES':
    case 'BINANCE_SPOT_WITH_FUTURES':
      return 'wss://stream.binance.com/ws';
    case 'BINANCE_FUTURES':
      return 'wss://fstream.binance.com/ws';
    case 'BYBIT_SPOT':
    case 'BYBIT_FUTURES':
      return 'wss://stream.bybit.com/v5/public/linear';

    case 'OKX_SPOT':
    case 'OKX_FUTURES':
      return 'wss://ws.okx.com:8443/ws/v5/business';

    case 'GATE_SPOT':
      return 'wss://api.gateio.ws/ws/v4/';
    case 'GATE_FUTURES':
      return 'wss://fx-ws.gateio.ws/v4/ws/usdt';
  }

  return '';
};
