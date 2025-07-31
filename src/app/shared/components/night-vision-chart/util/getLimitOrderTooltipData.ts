import { ClickedLimitOrderEventDetails } from '../../mini-chart/models/ClickedLimitOrderEvent';
import { CoinData } from '../../../models/CoinData';
import { convertNumber } from '../../../utils/convertNumber';
import { Exchange } from '../../../models/Exchange';
import { calculateDistance } from '../../../utils/calculateDistance';
import { calculateLifetime } from '../../../utils/calculateLifetime';
import { LimitOrderData } from '../../../models/LimitOrderData';
import { ChartSettings } from '../../../models/ChartSettings';
import { TranslateService } from '@ngx-translate/core';

export interface LimitOrderTooltipData {
  corrosion_time: number;
  living_time: number;
  price: number;
  sum: string;
  distance: string;
  touches: number;
  formation: boolean;
  quantity: string;
  resume: string;
}

export interface LimitOrderLevelData {
  touches?: number;
  formation?: boolean;
}

export type LimitOrderSize = 'big' | 'medium' | 'small';

export type ChartOverlayLevel = [number, number, { touches: number }]; // timestamp, price, data

export const getLimitOrderSize = (
  order: LimitOrderData | ClickedLimitOrderEventDetails,
  coinData: CoinData,
  exchange: Exchange,
): LimitOrderSize => {
  let isBigOrder = false;
  let isMediumOrder = false;

  if (exchange.includes('SPOT')) {
    isBigOrder = order.corrosion_time >= 3;
    isMediumOrder = order.corrosion_time >= 2 && order.corrosion_time < 3;
  }

  if (exchange.includes('FUTURES')) {
    isBigOrder = order.corrosion_time >= 3;
    isMediumOrder = order.corrosion_time >= 2 && order.corrosion_time < 3;

    isBigOrder =
      isBigOrder ||
      (coinData.volume_data?.volume_sum_24h <= 5_000_000_000 &&
        order.full_price >= 5_000_000) ||
      (coinData.volume_data?.volume_sum_24h <= 1_000_000_000 &&
        order.full_price >= 2_000_000) ||
      (coinData.volume_data?.volume_sum_24h <= 500_000_000 &&
        order.full_price >= 1_000_000) ||
      (coinData.volume_data?.volume_sum_24h <= 100_000_000 &&
        order.full_price >= 500_000);

    isMediumOrder =
      isMediumOrder ||
      (coinData.volume_data?.volume_sum_24h <= 5_000_000_000 &&
        order.full_price >= 3_000_000) ||
      (coinData.volume_data?.volume_sum_24h <= 1_000_000_000 &&
        order.full_price >= 1_000_000) ||
      (coinData.volume_data?.volume_sum_24h <= 500_000_000 &&
        order.full_price >= 500_000) ||
      (coinData.volume_data?.volume_sum_24h <= 100_000_000 &&
        order.full_price >= 200_000);
  }

  return isBigOrder ? 'big' : isMediumOrder ? 'medium' : 'small';
};

export const getFormationThreshold = (coinData: CoinData): number => {
  const volatility: number = coinData?.volatility_data?.volatilityIdx24h;

  if (!volatility) {
    return 0.2;
  }

  if (volatility < 0.5) {
    return 0.1;
  }

  if (volatility >= 0.5 && volatility < 1.5) {
    return 0.2;
  }

  if (volatility >= 1.5 && volatility < 3) {
    return 0.3;
  }

  if (volatility >= 3) {
    return 0.5;
  }

  return 0.25;
};

export const getLimitOrderTooltipData = (
  orderDetail: ClickedLimitOrderEventDetails,
  coinData: CoinData,
  exchange: Exchange,
  chartSettings: ChartSettings,
  levels: ChartOverlayLevel[],
  translateService: TranslateService
): LimitOrderTooltipData => {
  const onLevelLimitOrderData = getLimitOrderLevelData(
    orderDetail,
    getFormationThreshold(coinData),
    levels,
  );
  const living_time = calculateLifetime(
    orderDetail as unknown as LimitOrderData,
  );

  const resume = getOLimitOrderResume(
    orderDetail,
    exchange,
    coinData,
    onLevelLimitOrderData || {},
    living_time,
    translateService
  );

  return {
    price: orderDetail.price,
    corrosion_time: orderDetail.corrosion_time,
    living_time,
    resume,
    sum: convertNumber(orderDetail.full_price),
    distance: orderDetail.distance.toFixed(2),
    touches: onLevelLimitOrderData?.touches ?? undefined,
    formation: onLevelLimitOrderData?.formation ?? undefined,
    quantity: convertNumber(orderDetail.quantity),
  };
};

const getLimitOrderLevelData = (
  orderDetail: ClickedLimitOrderEventDetails | LimitOrderData,
  threshold: number,
  levels: ChartOverlayLevel[],
): LimitOrderLevelData | null => {
  for (const i in levels) {
    const level: ChartOverlayLevel = levels[i];
    if (
      calculateDistance(level[1], orderDetail.price) <= threshold
      // chartSettings.horizontalLevelsTouchesThreshold
    ) {
      const touches = level[2]?.touches || 0;
      // if (level[0] > orderDetail.created_time) touches++; // If the order was before the level was formed
      return { touches, formation: true };
    }
  }

  return null;
};

const getOLimitOrderResume = (
  orderDetail: ClickedLimitOrderEventDetails,
  exchange: Exchange,
  coinData: CoinData,
  limitOrderLevelData: LimitOrderLevelData,
  livingTime: number,
  translateService: TranslateService
): string => {
  const isRecentLimitOrder = livingTime < 60;
  const isOldLimitOrder = livingTime >= 60;

  const orderSize = getLimitOrderSize(orderDetail, coinData, exchange);

  if (
    orderSize === 'big' &&
    !limitOrderLevelData.formation &&
    isOldLimitOrder
  ) {
    return translateService.instant('limit_order_resume.big_no_formation_old');
  }

  if (
    orderSize === 'big' &&
    !limitOrderLevelData.formation &&
    isRecentLimitOrder
  ) {
    return translateService.instant('limit_order_resume.big_no_formation_recent');
  }

  if (
    orderSize === 'big' &&
    limitOrderLevelData.formation &&
    !limitOrderLevelData.touches &&
    isRecentLimitOrder
  ) {
    return translateService.instant('limit_order_resume.big_formation_zero_touches_recent');
  }

  if (
    orderSize === 'big' &&
    limitOrderLevelData.formation &&
    !limitOrderLevelData.touches &&
    isOldLimitOrder
  ) {
    return translateService.instant('limit_order_resume.big_formation_zero_touches_old');
  }

  if (
    orderSize === 'big' &&
    limitOrderLevelData.formation &&
    limitOrderLevelData.touches >= 1 &&
    isOldLimitOrder
  ) {
    return translateService.instant('limit_order_resume.big_formation_many_touches_old');
  }

  if (
    orderSize === 'big' &&
    limitOrderLevelData.formation &&
    limitOrderLevelData.touches >= 1 &&
    isRecentLimitOrder
  ) {
    return translateService.instant('limit_order_resume.big_formation_many_touches_recent');
  }

  if (
    orderSize === 'medium' &&
    limitOrderLevelData.formation &&
    !limitOrderLevelData.touches &&
    isRecentLimitOrder
  ) {
    return translateService.instant('limit_order_resume.medium_formation_zero_touches_recent');
  }

  if (
    orderSize === 'medium' &&
    limitOrderLevelData.formation &&
    !limitOrderLevelData.touches &&
    isOldLimitOrder
  ) {
    return translateService.instant('limit_order_resume.medium_formation_zero_touches_old');
  }

  if (
    orderSize === 'medium' &&
    limitOrderLevelData.formation &&
    limitOrderLevelData.touches >= 1 &&
    isOldLimitOrder
  ) {
    return translateService.instant('limit_order_resume.medium_formation_many_touches_old');
  }

  if (orderSize === 'medium' && !limitOrderLevelData.formation) {
    return translateService.instant('limit_order_resume.medium_no_formation');
  }

  return translateService.instant('limit_order_resume.small');
};
