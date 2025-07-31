import { Overlay, OverlayData } from 'night-vision/dist/types';
import { CoinData } from '../../models/CoinData';
import { CoinDataProps } from '../../models/chart-indicators/CoinData';

export const convertCoinDataToOverlay = (
  data: CoinData,
  props: CoinDataProps,
  fullChart = true,
): Overlay => {
  const textColor = document.body.classList.contains('dark-theme')
    ? '#dadada'
    : '#000000';
  return {
    name: fullChart ? 'Информация монеты' : '',
    type: 'CoinData',
    props: {
      isMobile: window.innerWidth < 820,
      fullChart,
      textColor,
      ...props,
    },
    settings: {
      zIndex: 0,
      // @ts-ignore
      showLegend: false,
    },
    data: [data] as unknown as OverlayData,
  };
};
