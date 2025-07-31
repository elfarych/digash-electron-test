import {WorkspaceCoins} from "./WorkspaceCoins";
import {CoinData} from "./CoinData";
import {Preferences} from "./Preferences";
import {Exchange} from "./Exchange";
import {Timeframe} from "./Timeframe";
import {Workspace} from "./Workspace";
import {ChartTechnicalIndicators} from "./chart-indicators/ChartIndicators";

export interface ChartNavigationFromWorkspaceModel {
  dialog: true;
  coin: string;
  coins: WorkspaceCoins[];
  coinData: CoinData;
  preferences: Preferences;
  exchange: Exchange;
  timeframe: Timeframe;
  showDailyHighAndLow: boolean;
  showLimitOrders: boolean;
  horizontalLevelsTouches: number;
  horizontalLevelsTouchesThreshold: number;
  horizontalLevelsLivingTime: number;
  showHorizontalLevels: boolean;
  workspace: Workspace;
  chartIndicators: ChartTechnicalIndicators[];
}
