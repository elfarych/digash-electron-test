export type Exchange =
  | 'ALL'
  | 'BINANCE_SPOT'
  | 'BINANCE_FUTURES'
  | 'BINANCE_SPOT_WITH_FUTURES'
  | 'BINANCE_SPOT_WITHOUT_FUTURES'
  | 'BYBIT_SPOT'
  | 'BYBIT_FUTURES'
  | 'BITGET_SPOT_WITHOUT_BINANCE'
  | 'BITGET_FUTURES_WITHOUT_BINANCE'
  | 'BITGET_SPOT'
  | 'BITGET_FUTURES'
  | 'GATE_SPOT'
  | 'GATE_FUTURES'
  | 'OKX_SPOT'
  | 'OKX_FUTURES'
  | 'MEXC_SPOT'
  | 'MEXC_FUTURES';

export const exchangeToSwapMap = {
  BINANCE_SPOT: 'BINANCE_FUTURES',
  BINANCE_FUTURES: 'BINANCE_SPOT',
  BINANCE_SPOT_WITH_FUTURES: 'BINANCE_FUTURES',
  BINANCE_SPOT_WITHOUT_FUTURES: 'BINANCE_FUTURES',
  BYBIT_SPOT: 'BYBIT_FUTURES',
  BYBIT_FUTURES: 'BYBIT_SPOT',
  BITGET_SPOT: 'BITGET_FUTURES',
  BITGET_FUTURES: 'BITGET_SPOT',
  BITGET_SPOT_WITHOUT_BINANCE: 'BITGET_FUTURES',
  BITGET_FUTURES_WITHOUT_BINANCE: 'BITGET_SPOT',
  GATE_SPOT: 'GATE_FUTURES',
  GATE_FUTURES: 'GATE_SPOT',
  OKX_SPOT: 'OKX_FUTURES',
  OKX_FUTURES: 'OKX_SPOT',
  MEXC_SPOT: 'MEXC_FUTURES',
  MEXC_FUTURES: 'MEXC_SPOT',
};

export const getExchangeToSwap = (exchange: Exchange): Exchange => {
  return exchangeToSwapMap[exchange] as Exchange;
};

export interface ExchangeData {
  name: string;
  exchangeName: string;
  defaultCoin: string;
  icon: string;
  translateKey: string;
  exchange: Exchange;
  primary: boolean;
  iconWithBg?: string;
  description?: string;
  monitoringAppKey?: string;
  market?: 'S' | 'F';
}
export const BINANCE_ICON = 'assets/svg/binance.svg';
export const BINANCE_FUTURES_ICON = 'assets/svg/binance-futures.svg';
export const BYBIT_ICON = 'assets/svg/bybit.svg';
export const BYBIT_ICON_WITH_BG = 'assets/svg/bybit-bg.svg';
export const BITGET_ICON = 'assets/svg/bitget.svg';
export const OKX_ICON = 'assets/svg/okx.svg';
export const GATE_ICON = 'assets/svg/gate.svg';
export const MEXC_ICON = 'assets/svg/mexc.svg';

export const getExchangesData = (): ExchangeData[] => {
  return [
    {
      exchange: 'BINANCE_SPOT',
      exchangeName: 'Binance',
      name: 'Binance Spot',
      icon: BINANCE_ICON,
      market: 'S',
      defaultCoin: 'BTCUSDT',
      primary: true,
      monitoringAppKey: 'binance-spot',
      translateKey: 'binance_spot',
    },
    {
      exchange: 'BINANCE_SPOT_WITHOUT_FUTURES',
      exchangeName: 'Binance',
      name: 'Binance Spot - Futures',
      icon: BINANCE_ICON,
      description: 'app.SpotWithoutFutures',
      market: 'S',
      defaultCoin: 'BTCUSDT',
      primary: false,
      translateKey: 'binance_spot_without_futures',
    },
    {
      exchange: 'BINANCE_SPOT_WITH_FUTURES',
      exchangeName: 'Binance',
      name: 'Binance Spot + Futures',
      icon: BINANCE_ICON,
      description: 'app.SpotWithFutures',
      market: 'S',
      defaultCoin: 'BTCUSDT',
      primary: false,
      translateKey: 'binance_spot_with_futures',
    },
    {
      exchange: 'BINANCE_FUTURES',
      exchangeName: 'Binance',
      name: 'Binance Futures',
      icon: BINANCE_ICON,
      market: 'F',
      defaultCoin: 'BTCUSDT',
      primary: true,
      monitoringAppKey: 'binance-fut',
      translateKey: 'binance_futures',
    },

    {
      exchange: 'BYBIT_SPOT',
      exchangeName: 'Bybit',
      name: 'Bybit Spot',
      icon: BYBIT_ICON,
      iconWithBg: BYBIT_ICON_WITH_BG,
      market: 'S',
      defaultCoin: 'BTCUSDT',
      primary: true,
      monitoringAppKey: 'bybit-spot',
      translateKey: 'bybit_spot',
    },
    {
      exchange: 'BYBIT_FUTURES',
      exchangeName: 'Bybit',
      name: 'Bybit Futures',
      icon: BYBIT_ICON,
      iconWithBg: BYBIT_ICON_WITH_BG,
      market: 'F',
      defaultCoin: 'BTCUSDT',
      primary: true,
      monitoringAppKey: 'bybit-fut',
      translateKey: 'bybit_futures',
    },
    {
      exchange: 'BITGET_FUTURES',
      exchangeName: 'Bitget',
      name: 'Bitget Futures',
      icon: BITGET_ICON,
      market: 'F',
      defaultCoin: 'BTCUSDT',
      primary: true,
      monitoringAppKey: 'bitget-fut',
      translateKey: 'bybit_futures',
    },
    {
      exchange: 'BITGET_SPOT',
      exchangeName: 'Bitget',
      name: 'Bitget Spot',
      icon: BITGET_ICON,
      market: 'S',
      defaultCoin: 'BTCUSDT',
      primary: true,
      monitoringAppKey: 'bitget-spot',
      translateKey: 'bitget_spot',
    },

    {
      exchange: 'GATE_FUTURES',
      exchangeName: 'Gate',
      name: 'Gate Futures',
      icon: GATE_ICON,
      market: 'F',
      defaultCoin: 'BTC_USDT',
      primary: true,
      monitoringAppKey: 'gate-fut',
      translateKey: 'gate_futures',
    },
    {
      exchange: 'GATE_SPOT',
      exchangeName: 'Gate',
      name: 'Gate Spot',
      icon: GATE_ICON,
      market: 'S',
      defaultCoin: 'BTC_USDT',
      primary: true,
      monitoringAppKey: 'gate-spot',
      translateKey: 'gate_spot',
    },
    {
      exchange: 'OKX_FUTURES',
      exchangeName: 'OKX',
      name: 'Okx Futures',
      icon: OKX_ICON,
      market: 'F',
      defaultCoin: 'BTC-USDT-SWAP',
      primary: true,
      monitoringAppKey: 'okx-fut',
      translateKey: 'okx_futures',
    },
    {
      exchange: 'OKX_SPOT',
      exchangeName: 'OKX',
      name: 'Okx Spot',
      icon: OKX_ICON,
      market: 'S',
      defaultCoin: 'BTC-USDT',
      primary: true,
      monitoringAppKey: 'okx-spot',
      translateKey: 'okx_spot',
    },
    {
      exchange: 'MEXC_SPOT',
      exchangeName: 'MEXC',
      name: 'MEXC Spot',
      icon: MEXC_ICON,
      market: 'S',
      primary: true,
      monitoringAppKey: 'mexc-spot',
      defaultCoin: 'BTC_USDT',
      translateKey: 'mexc_spot',
    },
    {
      exchange: 'MEXC_FUTURES',
      exchangeName: 'MEXC',
      name: 'MEXC Futures',
      icon: MEXC_ICON,
      market: 'F',
      primary: true,
      monitoringAppKey: 'mexc-fut',
      defaultCoin: 'BTC-USDT',
      translateKey: 'mexc_futures',
    },
  ];
};

export const getExchangeData = (exchange: Exchange): ExchangeData => {
  return getExchangesData().find((i) => i.exchange === exchange);
};

export const getMainExchangesData = (): ExchangeData[] => {
  return getExchangesData().filter((e) => e.primary);
};
