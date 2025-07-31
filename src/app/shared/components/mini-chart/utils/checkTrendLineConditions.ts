import { ChartLevelData } from '../../../models/ChartHorizontalLevels';
import { Workspace } from '../../../models/Workspace';

export const checkTrendLineConditions = (
  level: ChartLevelData,
  workspace: Workspace,
): boolean => {
  const horizontalLevelsTouches = workspace?.horizontalLevelsTouches ?? 0;
  return level.touches >= horizontalLevelsTouches;
};
