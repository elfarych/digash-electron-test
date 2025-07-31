import { Exchange } from './Exchange';

export const getExchangeOpenInterestAPI = (exchange: Exchange): string => {
  switch (exchange) {
    case 'BINANCE_SPOT':
    case 'BYBIT_SPOT':
      return '';
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
    case 'BINANCE_SPOT_WITH_FUTURES':
    case 'BINANCE_SPOT_WITHOUT_FUTURES':
      return 'https://api.binance.com/api/v3';
    case 'BINANCE_FUTURES':
      return 'https://fapi.binance.com/fapi/v1';
    case 'BYBIT_SPOT':
    case 'BYBIT_FUTURES':
      return 'https://api.bybit.com/v5/market';
    case 'BITGET_SPOT':
    case 'BITGET_FUTURES':
    case 'BITGET_SPOT_WITHOUT_BINANCE':
    case 'BITGET_FUTURES_WITHOUT_BINANCE':
      return 'https://api.bitget.com/api/v2';
  }

  return '';
};

export const getExchangeWS = (exchange: Exchange): string => {
  switch (exchange) {
    case 'BINANCE_SPOT':
    case 'BINANCE_SPOT_WITH_FUTURES':
    case 'BINANCE_SPOT_WITHOUT_FUTURES':
      return 'wss://stream.binance.com/ws';
    case 'BINANCE_FUTURES':
      return 'wss://fstream.binance.com/ws';
    case 'BYBIT_SPOT':
      return 'wss://stream.bybit.com/v5/public/spot';
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
