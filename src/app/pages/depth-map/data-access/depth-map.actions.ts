import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  DepthMapCoinsData,
  DepthMapData,
  DepthMapSettings,
} from '../utils/models';

export const DepthMapActions = createActionGroup({
  source: 'DepthMap actions',
  events: {
    'Load settings': emptyProps(),
    'Load settings success': props<{ data: DepthMapSettings }>(),
    'Load settings error': props<{ errorMessage: string }>(),

    'Update settings': props<{ data: DepthMapSettings }>(),
    'Update settings success': props<{ data: DepthMapSettings }>(),
    'Update settings error': props<{ errorMessage: string }>(),

    'Load depth data': emptyProps,
    'Load depth data success': props<{
      data: DepthMapData;
      coinsData: DepthMapCoinsData;
    }>(),
    'Load depth data error': props<{ errorMessage: string }>(),
  },
});
