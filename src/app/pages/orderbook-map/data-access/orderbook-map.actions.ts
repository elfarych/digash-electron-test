import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  OrderbookMapCoinsData,
  OrderbookMapData,
  OrderbookMapSettings,
} from '../utils/models';

export const OrderbookMapActions = createActionGroup({
  source: 'Orderbook actions',
  events: {
    'Load settings': emptyProps(),
    'Load settings success': props<{ data: OrderbookMapSettings }>(),
    'Load settings error': props<{ errorMessage: string }>(),

    'Update settings': props<{ data: OrderbookMapSettings }>(),
    'Update settings success': props<{ data: OrderbookMapSettings }>(),
    'Update settings error': props<{ errorMessage: string }>(),

    'Load orderbook data': emptyProps,
    'Load orderbook data success': props<{
      data: OrderbookMapData;
      coinsData: OrderbookMapCoinsData;
    }>(),
    'Load orderbook data error': props<{ errorMessage: string }>(),
  },
});
