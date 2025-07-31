import { CoinDataHorizontalLevelData } from '../../models/CoinData';
import { Workspace } from '../../models/Workspace';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { detectRoundNumber } from '../detectRoundNumber';

const getNearestLevelDistancePercent = (
  price: number,
  levels: CoinDataHorizontalLevelData[],
): number => {
  if (levels.length === 0) return Number.MAX_SAFE_INTEGER;

  const nearestLevel = levels
    .map((l) => l[1])
    .reduce((closestLevel, currentLevel) => {
      return Math.abs(currentLevel - price) < Math.abs(closestLevel - price)
        ? currentLevel
        : closestLevel;
    });

  return (Math.abs(nearestLevel - price) / price) * 100;
};

const getMinutesUntilNow = (timestamp: number): number => {
  const now = Date.now();
  const difference = now - timestamp;
  return Math.floor(difference / 60000);
};

export const calculateHorizontalLevelsFormation = (
  data: WorkspaceCoins[],
  workspace: Workspace,
): WorkspaceCoins[] => {
  const result: WorkspaceCoins[] = [];
  for (const { symbol, data: symbolData } of data) {
    const horizontalLevelsData: CoinDataHorizontalLevelData[] =
      symbolData.horizontal_levels?.[workspace.timeframe];

    const levels: CoinDataHorizontalLevelData[] = horizontalLevelsData
      .filter((l) =>
        workspace.roundHorizontalLevels
          ? detectRoundNumber(symbolData.current_price, l[1])
          : true,
      )
      .filter((l) => l[2].touches === workspace.horizontalLevelsTouches)
      .filter((l) =>
        workspace.horizontalLevelsLivingTime > 0
          ? getMinutesUntilNow(l[0]) <= workspace.horizontalLevelsLivingTime
          : true,
      );

    symbolData.nearest_level_distance = getNearestLevelDistancePercent(
      symbolData.current_price,
      levels ?? [],
    );

    result.push({
      symbol,
      data: {
        ...symbolData,
        formation: !!levels.length,
        use_backend_levels: true,
      },
    });
  }

  return result;
};
