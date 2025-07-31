import { Overlay } from 'night-vision/dist/types';
import { UserTradesProcessedData } from '../../api/user-trades-data/user-trades-data.models';
import { getTextColor } from '../../models/chart-indicators/CoinData';
import { scriptsCalculator } from './scriptsCalculator';
import { Exchange } from '../../models/Exchange';
import { CoinData } from '../../models/CoinData';
import { CandlestickIntervals } from '../../models/Candlestick';
import { AlertNotification } from '../../models/Notification';
import { ChartTechnicalIndicators } from '../../models/chart-indicators/ChartIndicators';
import { Liquidation } from '../Liquidation';

export const convertTechnicalIndicatorToOverlay = (
  indicator: ChartTechnicalIndicators,
  candlesData: number[][],
  precision: number,
  symbolData?: CoinData,
  exchange?: Exchange,
  fullChart: boolean = false,
  userTrades?: UserTradesProcessedData[],
  notifications?: AlertNotification[],
  timeframe?: CandlestickIntervals,
  liquidationsData?: { [tick: string]: Liquidation },
): Overlay => {
  const showLegend = fullChart;
  return {
    name: indicator.label,
    type: indicator.overlay,
    category: indicator.name,
    zIndex: 1,
    settings: {
      zIndex: indicator.name === 'CoinData' ? 0 : 1,
      // @ts-ignore
      legendSettings: [
        {
          id: 'settings',
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM5ODk4OTgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iNDgiPjxwYXRoIGQ9Im0zODgtODAtMjAtMTI2cS0xOS03LTQwLTE5dC0zNy0yNWwtMTE4IDU0LTkzLTE2NCAxMDgtNzlxLTItOS0yLjUtMjAuNVQxODUtNDgwcTAtOSAuNS0yMC41VDE4OC01MjFMODAtNjAwbDkzLTE2NCAxMTggNTRxMTYtMTMgMzctMjV0NDAtMThsMjAtMTI3aDE4NGwyMCAxMjZxMTkgNyA0MC41IDE4LjVUNjY5LTcxMGwxMTgtNTQgOTMgMTY0LTEwOCA3N3EyIDEwIDIuNSAyMS41dC41IDIxLjVxMCAxMC0uNSAyMXQtMi41IDIxbDEwOCA3OC05MyAxNjQtMTE4LTU0cS0xNiAxMy0zNi41IDI1LjVUNTkyLTIwNkw1NzItODBIMzg4Wm05Mi0yNzBxNTQgMCA5Mi0zOHQzOC05MnEwLTU0LTM4LTkydC05Mi0zOHEtNTQgMC05MiAzOHQtMzggOTJxMCA1NCAzOCA5MnQ5MiAzOFptMC02MHEtMjkgMC00OS41LTIwLjVUNDEwLTQ4MHEwLTI5IDIwLjUtNDkuNVQ0ODAtNTUwcTI5IDAgNDkuNSAyMC41VDU1MC00ODBxMCAyOS0yMC41IDQ5LjVUNDgwLTQxMFptMC03MFptLTQ0IDM0MGg4OGwxNC0xMTJxMzMtOCA2Mi41LTI1dDUzLjUtNDFsMTA2IDQ2IDQwLTcyLTk0LTY5cTQtMTcgNi41LTMzLjVUNzE1LTQ4MHEwLTE3LTItMzMuNXQtNy0zMy41bDk0LTY5LTQwLTcyLTEwNiA0NnEtMjMtMjYtNTItNDMuNVQ1MzgtNzA4bC0xNC0xMTJoLTg4bC0xNCAxMTJxLTM0IDctNjMuNSAyNFQzMDYtNjQybC0xMDYtNDYtNDAgNzIgOTQgNjlxLTQgMTctNi41IDMzLjVUMjQ1LTQ4MHEwIDE3IDIuNSAzMy41VDI1NC00MTNsLTk0IDY5IDQwIDcyIDEwNi00NnEyNCAyNCA1My41IDQxdDYyLjUgMjVsMTQgMTEyWiIvPjwvc3ZnPg0K',
        },
        {
          id: 'close',
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iIzk4OTg5OCIgY2xhc3M9InctNiBoLTYiPg0KICA8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik02IDE4TDE4IDZNNiA2bDEyIDEyIiAvPg0KPC9zdmc+DQo=',
        },
      ],
      showLegend,
    },
    data: scriptsCalculator({
      type: indicator,
      candlesData: candlesData,
      precision,
      openInterestData: [],
      symbolData,
      userTrades: userTrades ?? [],
      notifications,
      timeframe,
      liquidationsData,
    }),
    props: {
      ...indicator.props,
      exchange,
      fullChart,
      textColor: getTextColor(),
    },
  };
};
