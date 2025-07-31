import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Alert, PriceAlert } from '../../models/Alert';
import { Exchange } from '../../models/Exchange';
import { MovedPriceLevelEventDetails } from '../../models/MovedPriceLevelEvent';
import { AlertSettings } from '../../models/AlertSettings';

export const AlertsAPIActions = createActionGroup({
  source: 'Alerts API actions',

  events: {
    'Get alerts': emptyProps(),
    'Get alerts success': props<{ data: Alert[] }>(),
    'Get alerts error': props<{ errorMessage: string }>(),

    'Get alert settings': emptyProps(),
    'Get alert settings success': props<{ data: AlertSettings }>(),
    'Get alert settings error': props<{ errorMessage: string }>(),

    'Update alert settings': props<{ data: AlertSettings }>(),
    'Update alert settings success': props<{ data: AlertSettings }>(),
    'Update alert settings error': props<{ errorMessage: string }>(),

    'Create alert': props<{ data: Alert }>(),
    'Create alert success': props<{ data: Alert }>(),
    'Create alert error': props<{ errorMessage: string }>(),

    'Create fast price alert': props<{
      value: number;
      symbol: string;
      market: Exchange;
    }>(),
    'Create fast price alert success': props<{ data: Alert }>(),
    'Create fast price alert error': props<{ errorMessage: string }>(),

    'Trigger price alert': props<{ data: PriceAlert }>(),

    'Remove alert': props<{ alertId: number }>(),
    'Remove alert success': props<{ data: Alert[] }>(),
    'Remove alert error': props<{ errorMessage }>(),

    'Remove all inactive alerts': emptyProps(),
    'Remove all inactive success': props<{ data: Alert[] }>(),
    'Remove all inactive error': props<{ errorMessage: string }>(),

    'Activate alert': props<{ alertId: number }>(),
    'Activate alert success': props<{ alertId: number }>(),
    'Activate alert error': props<{ errorMessage }>(),

    'Deactivate alert': props<{ alertId: number }>(),
    'Deactivate alert success': props<{ alertId: number }>(),
    'Deactivate alert error': props<{ errorMessage }>(),

    'Update alert': props<{ data: Alert; alertId: number }>(),
    'Update alert success': props<{ data: Alert }>(),
    'Update alert error': props<{ errorMessage: string }>(),

    'Move signal level': props<{ data: MovedPriceLevelEventDetails }>(),
    'Move signal level success': props<{ data: Alert }>(),
    'Move signal level error': props<{ errorMessage: string }>(),

    Clear: emptyProps(),
  },
});
