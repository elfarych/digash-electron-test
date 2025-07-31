import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { Workspace } from '../../models/Workspace';
import { filterLimitOrders } from '../filterLimitOrders';
import { calculateDistance } from '../calculateDistance';
import { ChartLevel, ChartLevelData } from '../../models/ChartHorizontalLevels';
import { LimitOrderData } from '../../models/LimitOrderData';
import { FormationForm } from '../../models/formations/FormationForm';

const checkLevelAndLimitOrder = (
  level: ChartLevelData,
  order: LimitOrderData,
  formationData: FormationForm,
  orderType: 'a' | 'b',
  currentPrice: number,
): boolean => {
  const distance = calculateDistance(level.value, order.price);
  const checkDistance =
    distance <= (formationData?.formationLimitOrderLevelDistance ?? 0.5);

  const checkTouches = level.touches >= formationData?.formationLevelTouches;

  let checkLocation = false;
  if (formationData.formationLimitOrderLevelLocation === 'up') {
    if (level.value > currentPrice) {
      checkLocation = order.price > level.value;
    } else {
      checkLocation = order.price < level.value;
    }
  }
  if (formationData.formationLimitOrderLevelLocation === 'down') {
    if (level.value > currentPrice) {
      checkLocation = order.price < level.value;
    } else {
      checkLocation = order.price > level.value;
    }
  }
  if (formationData.formationLimitOrderLevelLocation === 'same') {
    checkLocation = level.value === order.price;
  }
  if (formationData.formationLimitOrderLevelLocation === 'none') {
    checkLocation = true;
  }

  return checkDistance && checkTouches && checkLocation;
};

const processLevels = (
  levels: ChartLevel[] | undefined,
  orders: LimitOrderData[],
  orderType: 'a' | 'b',
  formationData: FormationForm,
  currentPrice: number,
): boolean => {
  if (!levels) return false;
  let formation = false;

  for (const l of levels) {
    const level: ChartLevelData = {
      time: l[0],
      value: l[1],
      touches: l[2]?.touches ?? 0,
      formation: false,
    };
    level[orderType] = [];

    for (const order of orders) {
      const distance = calculateDistance(level.value, order.price);

      if (
        checkLevelAndLimitOrder(
          level,
          order,
          formationData,
          orderType,
          currentPrice,
        )
      ) {
        level[orderType].push({ ...order, distance });
      }
    }

    level.formation = Boolean(level.b?.length) || Boolean(level.a?.length);

    if (!formation) {
      formation = level.formation;
    }
  }

  return formation;
};

export const calculateHorizontalLevelsWithLimitOrdersFormation = (
  data: WorkspaceCoins[],
  workspace: Workspace,
): WorkspaceCoins[] => {
  for (const { symbol, data: symbolData } of data) {
    const horizontalLevels =
      symbolData.horizontal_levels?.[workspace.timeframe];
    const asks = filterLimitOrders(symbolData.a ?? [], workspace);
    const bids = filterLimitOrders(symbolData.b ?? [], workspace);

    const formationData: FormationForm = {
      formationLimitOrderLevelLocation:
        workspace.formationLimitOrderLevelLocation,
      formationLimitOrderLevelDistance:
        workspace.formationLimitOrderLevelDistance,
      formationLevelTouches: workspace.horizontalLevelsTouches,
      formationLevelTouchesThreshold: workspace.formationLevelTouchesThreshold,
    };

    const formation1 = processLevels(
      horizontalLevels,
      bids,
      'b',
      formationData,
      symbolData.current_price,
    );
    const formation2 = processLevels(
      horizontalLevels,
      asks,
      'a',
      formationData,
      symbolData.current_price,
    );

    symbolData.formation = formation1 || formation2;
  }

  return data;
};

export const calculateLimitOrdersFormation = (
  data: WorkspaceCoins[],
  workspace: Workspace,
): WorkspaceCoins[] => {
  for (const { data: symbolData } of data) {
    const asks = filterLimitOrders(symbolData.a ?? [], workspace);
    const bids = filterLimitOrders(symbolData.b ?? [], workspace);
    if (workspace.sortByFormations) {
      symbolData.a = asks.sort(
        (a, b) => Math.abs(a.distance) - Math.abs(b.distance),
      );
      symbolData.b = bids.sort(
        (a, b) => Math.abs(a.distance) - Math.abs(b.distance),
      );
    }

    symbolData.formation = !!asks.length || !!bids.length;
  }

  if (workspace.sortByFormations) {
    data = data.sort((a, b) => {
      const askOrderA = a.data.a[0]?.distance ?? Infinity;
      const bidOrderA = a.data.b[0]?.distance ?? Infinity;
      const askOrderB = b.data.a[0]?.distance ?? Infinity;
      const bidOrderB = b.data.b[0]?.distance ?? Infinity;

      const distanceA = Math.min(askOrderA, bidOrderA);
      const distanceB = Math.min(askOrderB, bidOrderB);

      return Math.abs(distanceA) - Math.abs(distanceB);
    });
  }

  return data;
};
