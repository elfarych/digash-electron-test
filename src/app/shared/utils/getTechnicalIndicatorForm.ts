import { ChartTechnicalIndicators } from '../models/chart-indicators/ChartIndicators';
import { ChartIndicatorPropFormControl } from '../models/chart-indicators/ChartIndicatorsProps';
import { CoinDataForm } from '../models/chart-indicators/CoinData';
import { RSIForm } from '../models/chart-indicators/RSI';
import { OIForm } from '../models/chart-indicators/OI';
import { ATRForm } from '../models/chart-indicators/ATR';
import { TranslateService } from '@ngx-translate/core';
import { userTradesIndicatorForm } from '../models/chart-indicators/UserTrades';
import { notificationsStoryForm } from '../models/chart-indicators/NotificationsStory';
import { LiquidationsBubblesForm } from '../models/chart-indicators/LiquidationsBubbles';
import { SessionZonesForm } from '../models/chart-indicators/SessionZones';

export const getTechnicalIndicatorForm = (
  type: ChartTechnicalIndicators,
  translateService: TranslateService,
  premium: boolean,
): ChartIndicatorPropFormControl[] => {
  switch (type.name) {
    case 'RSI':
      return RSIForm(translateService);
    case 'OI':
      return OIForm;
    case 'CoinData':
      return CoinDataForm(translateService, premium);
    case 'ATR':
      return ATRForm;
    case 'UserTrades':
      return userTradesIndicatorForm;
    case 'NotificationsStory':
      return notificationsStoryForm(translateService);
    case 'LiquidationBubbles':
      return LiquidationsBubblesForm;
    case 'SessionZones':
      return SessionZonesForm;
    default:
      return [];
  }
};
