import { calculateHorizontalLevelsFormation } from './calculateHorizontalLevelsFormation';
import {
  calculateHorizontalLevelsWithLimitOrdersFormation,
  calculateLimitOrdersFormation,
} from './calculateHorizontalLevelsWithLimitOrdersFormation';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { Workspace } from '../../models/Workspace';
import { calculateTrendLevelFormation } from './calculateTrendLevelFormation';

export const calculateFormations = (
  workspace: Workspace,
  data: WorkspaceCoins[],
): WorkspaceCoins[] => {
  if (!data) {
    return void 0;
  }

  const tmpData: WorkspaceCoins[] = JSON.parse(JSON.stringify(data));

  switch (workspace.formation) {
    case 'HorizontalLevelWithLimitOrder':
      return calculateHorizontalLevelsWithLimitOrdersFormation(
        tmpData,
        workspace,
      );
    case 'ActiveCoins':
      return tmpData.map((i) => {
        return {
          ...i,
          data: {
            ...i.data,
            formation: i.data.activity?.is_active || i.data?.is_active,
          },
        };
      });
    case 'CoinsWithDensity':
      return calculateLimitOrdersFormation(tmpData, workspace);
    case 'HorizontalLevels':
      return calculateHorizontalLevelsFormation(tmpData, workspace);
    case 'TrendLevels':
      return calculateTrendLevelFormation(tmpData, workspace);
    default:
      return tmpData;
  }
};
