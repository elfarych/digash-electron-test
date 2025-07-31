import { Alert } from '../../models/Alert';
import { Overlay } from 'night-vision/dist/types';

export const convertPriceLevelToOverlay = (alerts: Alert[]): Overlay => {
  return {
    name: 'Сигнальные уровни',
    type: 'SignalLevel',
    props: {
      color: '#ba0179',
    },
    settings: {
      zIndex: 1,
      // @ts-ignore
      showLegend: false,
    },
    data: alerts.map((alert: Alert) => [
      { symbol: alert.symbol, value: alert.price_crossing, id: alert.id },
    ]),
  };
};
