import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SortingId } from '../../models/CoinsSorting';
import { SortingDirection } from '../../models/Sorting';
import {
  CoinsNavigationState,
  CoinsNavigationStateSettings,
} from './coins-navigation.reducer';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { Exchange } from '../../models/Exchange';
import { ChartSettings } from '../../models/ChartSettings';
import {
  CoinsNavigationData,
  CoinsNavigationRawData,
} from '../../models/CoinsNavigationData';
import { ChartNavigationFromWorkspaceModel } from '../../models/ChartNavigationFromWorkspace.model';
import { Density } from '../../utils/densities';
import { Preset } from '../../models/Preset';

export const CoinsNavigationStreamActions = createActionGroup({
  source: 'Coins navigation stream actions',
  events: {
    'Coins navigation data update': props<{ data: WorkspaceCoins[] }>(),
  },
});

export const CoinsNavigationActions = createActionGroup({
  source: 'Coins navigations actions',
  events: {
    'Load coins navigation data': props<{
      exchange: Exchange;
      sorting: boolean;
      filtering: boolean;
      forceRedirect: boolean;
      loading: boolean;
    }>(),
    'Load coins navigation data success': props<{
      data: CoinsNavigationRawData;
    }>(),
    'Load coins navigation data error': props<{ errorMessage: string }>(),

    'Load coins navigation settings': emptyProps(),
    'Load coins navigation settings success': props<{
      settings: CoinsNavigationStateSettings;
    }>(),
    'Load coins navigation settings error': props<{ errorMessage: string }>(),

    'Load coins navigation from workspace': props<{
      data: ChartNavigationFromWorkspaceModel;
    }>(),
    'Load coins navigation from workspace success': props<{
      settings: CoinsNavigationStateSettings;
      coins: WorkspaceCoins[];
      allCoins: WorkspaceCoins[];
      sorting: boolean;
      initialCoinsNavigationData: CoinsNavigationData;
    }>(),
    'Load coins navigation from workspace error': props<{
      errorMessage: string;
    }>(),

    'Update coins navigation': props<{
      data: CoinsNavigationState['settings'];
    }>(),
    'Update coins navigation success': props<{ coins: WorkspaceCoins[] }>(),

    'Set coins navigation data': props<{ data: CoinsNavigationState }>(),

    'Toggle column': props<{ id: SortingId }>(),
    'Toggle sorting by alerts': emptyProps(),
    'Toggle navigation auto size': emptyProps(),

    'Change sorting type': props<{ sortingDirection: SortingDirection }>(),
    'Change sorting column': props<{ id: SortingId }>(),

    'Process densities success': props<{ densities: Density[] }>(),

    'Coin data processing success': props<{ coins: WorkspaceCoins[] }>(),

    'Exclude exchanges': props<{ exchanges: Exchange[] }>(),

    'Reset columns': emptyProps(),
    'Reset columns success': emptyProps(),

    'Load presets': emptyProps(),
    'Load presets success': props<{ presets: Preset[] }>(),
    'Load presets error': props<{ errorMessage: string }>(),

    'Create preset': props<{ data: Partial<Preset> }>(),
    'Create preset success': props<{ preset: Preset }>(),
    'Create preset error': props<{ errorMessage: string }>(),

    'Update preset': props<{ data: Partial<Preset> }>(),
    'Update preset success': props<{ preset: Preset }>(),
    'Update preset error': props<{ errorMessage: string }>(),

    'Select preset': props<{ preset: Preset }>(),
    'Select preset success': props<{ preset: Preset }>(),
    'Select preset error': props<{ errorMessage: string }>(),

    'Delete preset': props<{ id: number }>(),
    'Delete preset success': emptyProps(),
    Destroy: emptyProps(),
  },
});

export const CoinNavigationChartSettingsActions = createActionGroup({
  source: 'Coins navigations chart settings actions',
  events: {
    'Update chart settings': props<{ data: ChartSettings }>(),
    'Update chart settings success': emptyProps(),
    'Update chart settings error': props<{ errorMessage: string }>(),

    'Load chart settings': emptyProps(),
    'Load chart settings success': props<{ data: ChartSettings }>(),
    'Load chart settings error': props<{ errorMessage: string }>(),
  },
});
