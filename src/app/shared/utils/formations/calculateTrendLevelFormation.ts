import { TrendLevel } from '../../models/CoinData';
import { Workspace } from '../../models/Workspace';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';

const getNearestLevelDistancePercent = (
  price: number,
  levels: TrendLevel[],
): number => {
  if (levels.length === 0) return Number.MAX_SAFE_INTEGER;
  const nearestLevel = levels
    .map((l) => l[1][1])
    .reduce((closestLevel, currentLevel) => {
      return Math.abs(currentLevel - price) < Math.abs(closestLevel - price)
        ? currentLevel
        : closestLevel;
    });
  return (Math.abs(nearestLevel - price) / price) * 100;
};

export const calculateTrendLevelFormation = (
  data: WorkspaceCoins[],
  workspace: Workspace,
): WorkspaceCoins[] => {
  const result: WorkspaceCoins[] = [];
  for (const { symbol, data: symbolData } of data) {
    const levels = symbolData.trend_levels?.[workspace.timeframe];

    symbolData.nearest_level_distance = getNearestLevelDistancePercent(
      symbolData.current_price,
      levels ?? [],
    );

    result.push({
      symbol,
      data: {
        ...symbolData,
        formation: !!levels.length,
        use_backend_trend_levels: true,
      },
    });
  }

  return result;
};
