import {
  allSortingColumns,
  CoinSortingType,
  SortingId,
} from '../../models/CoinsSorting';
import { createReducer, on } from '@ngrx/store';
import {
  SortingDirection,
  SortingType,
  SortingTypeRange,
} from '../../models/Sorting';
import {
  CoinNavigationChartSettingsActions,
  CoinsNavigationActions,
} from './coins-navigation.actions';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import {
  ChartSettings,
  defaultChartSettings,
} from '../../models/ChartSettings';
import { Exchange } from '../../models/Exchange';
import {
  CoinsNavigationData,
  CoinsNavigationRawData,
} from '../../models/CoinsNavigationData';
import { Density } from '../../utils/densities';
import { Preset } from '../../models/Preset';
import { getWorkspaceCoinsFromData } from './coins-data-processing';

export interface CoinsNavigationStateSettings {
  exchange: Exchange;
  sortingDirection?: SortingDirection;
  columns: SortingId[];
  sortingId?: SortingId;
  sorting: SortingType;
  sorting_range?: SortingTypeRange;
  sorting_direction: SortingDirection;
  sort_by_alerts?: boolean;
  navigation_auto_size?: boolean;
  chart_settings?: ChartSettings;
}

export interface CoinsNavigationState {
  settings: CoinsNavigationStateSettings;
  chartSettings: ChartSettings;
  coins: WorkspaceCoins[];
  coinsData: CoinsNavigationRawData;
  fromWorkspace: boolean;
  allCoins: WorkspaceCoins[];
  loading: boolean;
  densities: Density[];
  initialCoinsNavigationData: CoinsNavigationData;
  presets: Preset[];
  selectedPreset: Preset | null;
}

export const initialCoinsNavigation: CoinsNavigationState = {
  settings: {
    exchange: 'BINANCE_SPOT',
    columns: [
      'Alert',
      'Watchlist',
      'V24h',
      'CH24h',
      'VOL24h',
      'COR24h',
      'T24h',
    ],

    sorting: 'alphabetically',
    sorting_range: undefined,
    sorting_direction: 'asc',
    sort_by_alerts: false,
    navigation_auto_size: false,
  },
  fromWorkspace: false,
  chartSettings: undefined,
  coins: [],
  allCoins: [],
  densities: [],
  loading: true,
  initialCoinsNavigationData: undefined,
  presets: [],
  selectedPreset: null,
  coinsData: {},
};

export const coinsNavigationReducer = createReducer(
  initialCoinsNavigation,

  on(
    CoinsNavigationActions.loadCoinsNavigationData,
    (state, { exchange, loading }) => {
      return {
        ...state,
        loading,
        settings: {
          ...state.settings,
          exchange,
        },
      };
    },
  ),

  on(CoinsNavigationActions.destroy, (state) => {
    return initialCoinsNavigation;
  }),

  on(
    CoinsNavigationActions.loadCoinsNavigationSettingsSuccess,
    (state, { settings }) => {
      const getValidValue = (value, defaultValue) =>
        value && Object.keys(value).length > 0 ? value : defaultValue;

      const columns = getValidValue(
        settings.columns,
        initialCoinsNavigation.settings.columns,
      );
      const sortingValue = getValidValue(
        settings.sorting,
        initialCoinsNavigation.settings.sorting,
      );
      const sortingRange = getValidValue(
        settings.sorting_range,
        initialCoinsNavigation.settings.sorting_range,
      );
      const sortingDirection = getValidValue(
        settings.sorting_direction,
        initialCoinsNavigation.settings.sorting_direction,
      );
      const sortingId =
        allSortingColumns().find(
          (column) =>
            column.sorting === sortingValue &&
            column.trendSubType === sortingRange,
        )?.id ?? 'Coin';

      return {
        ...state,
        loading: false,
        settings: {
          ...state.settings,
          sortingId,
          sorting: sortingValue,
          sorting_range: sortingRange,
          sorting_direction: sortingDirection,
          sort_by_alerts: settings.sort_by_alerts,
          navigation_auto_size: settings.navigation_auto_size,
          columns,
        },
        chartSettings: {
          ...state.chartSettings,
          ...settings.chart_settings,
        },
      };
    },
  ),

  on(CoinsNavigationActions.toggleColumn, (state, { id }) => {
    const columns = [...state.settings.columns] ?? [];
    const idx = columns.indexOf(id);
    if (idx === -1) {
      columns.push(id);
    } else {
      columns.splice(idx, 1);
    }

    return {
      ...state,
      settings: {
        ...state.settings,
        columns,
      },
    };
  }),

  on(
    CoinsNavigationActions.changeSortingType,
    (state, { sortingDirection }) => {
      return {
        ...state,
        sorting_direction: sortingDirection,
      };
    },
  ),

  on(CoinsNavigationActions.changeSortingColumn, (state, { id }) => {
    let sortingDirection: SortingDirection = 'desc';
    let sortingId = id;

    if (id === state.settings.sortingId) {
      if (state.settings.sorting_direction === 'desc') {
        sortingDirection = 'asc';

        if (state.settings.sortingId === 'Watchlist') {
          sortingDirection = 'desc';
          sortingId = 'Watchlist';
        }
      } else {
        sortingDirection = 'desc';
      }
    }

    const sorting: CoinSortingType = allSortingColumns().find(
      (sorting) => sorting.id === id,
    );

    return {
      ...state,
      settings: {
        ...state.settings,
        loading: true,
        sortingId,
        sorting: sorting?.sorting,
        sorting_range: sorting?.trendSubType,
        sorting_direction: sortingDirection,
        sort_by_alerts: false,
      },
    };
  }),

  on(
    CoinsNavigationActions.toggleSortingByAlerts,
    (state: CoinsNavigationState): CoinsNavigationState => {
      return {
        ...state,
        settings: {
          ...state.settings,
          sort_by_alerts: !state.settings.sort_by_alerts,
        },
      };
    },
  ),

  on(
    CoinsNavigationActions.toggleNavigationAutoSize,
    (state: CoinsNavigationState): CoinsNavigationState => {
      return {
        ...state,
        settings: {
          ...state.settings,
          navigation_auto_size: !state.settings.navigation_auto_size,
        },
      };
    },
  ),

  on(
    CoinNavigationChartSettingsActions.loadChartSettingsSuccess,
    (state, { data }) => {
      return {
        ...state,
        chartSettings: {
          ...data,
          showDensitiesWidget: data.showDensitiesWidget ?? true,
          densitiesWidgetSettings:
            data.densitiesWidgetSettings ??
            defaultChartSettings.densitiesWidgetSettings,
        },
      };
    },
  ),

  on(
    CoinsNavigationActions.loadCoinsNavigationDataSuccess,
    (state, { data }) => {
      return {
        ...state,
        loading: false,
        coinsData: data,
        allCoins: getWorkspaceCoinsFromData(data),
      };
    },
  ),

  on(
    CoinsNavigationActions.loadCoinsNavigationFromWorkspace,
    (state, { data }) => {
      const getValidValue = (value, defaultValue) =>
        value && Object.keys(value).length > 0 ? value : defaultValue;

      const columns = initialCoinsNavigation.settings.columns;
      const sortingValue = getValidValue(
        data.workspace.sortingType,
        initialCoinsNavigation.settings.sorting,
      );
      const sortingRange = getValidValue(
        data.workspace.sortingTypeRange,
        initialCoinsNavigation.settings.sorting_range,
      );
      const sortingDirection =
        initialCoinsNavigation.settings.sorting_direction;

      const sortingId =
        allSortingColumns().find(
          (column) =>
            column.sorting === sortingValue &&
            column.trendSubType === sortingRange,
        )?.id ?? 'Coin';

      return {
        ...state,
        loading: false,
        allCoins: data.coins ?? [],
        coins: data.coins,
        fromWorkspace: true,
        // initialCoinsNavigationData,
        settings: {
          ...state.settings,
          sortingId,
          sorting: sortingValue,
          sorting_range: sortingRange,
          sorting_direction: sortingDirection,
          sort_by_alerts: false,
          navigation_auto_size: false,
          columns,
        },
      };
    },
  ),

  on(
    CoinNavigationChartSettingsActions.updateChartSettings,
    (state, { data }) => {
      return {
        ...state,
        chartSettings: data,
        // loading: true
      };
    },
  ),
  on(CoinNavigationChartSettingsActions.updateChartSettingsSuccess, (state) => {
    return {
      ...state,
      loading: false,
    };
  }),
  on(CoinsNavigationActions.updateCoinsNavigation, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(CoinsNavigationActions.resetColumnsSuccess, (state) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        columns: initialCoinsNavigation.settings.columns,
      },
    };
  }),
  on(CoinsNavigationActions.processDensitiesSuccess, (state, { densities }) => {
    return {
      ...state,
      densities,
    };
  }),
  on(CoinsNavigationActions.excludeExchanges, (state, { exchanges }) => {
    return {
      ...state,
      chartSettings: {
        ...state.chartSettings,
        excludedExchanges: exchanges,
      },
    };
  }),

  on(CoinsNavigationActions.loadPresetsSuccess, (state, { presets }) => {
    return {
      ...state,
      presets,
      selectedPreset: presets.find((p) => p.selected) ?? null,
    };
  }),
  on(CoinsNavigationActions.selectPresetSuccess, (state, { preset }) => {
    return {
      ...state,
      selectedPreset: preset,
    };
  }),
  on(CoinsNavigationActions.createPresetSuccess, (state, { preset }) => {
    return {
      ...state,
      selectedPreset: preset,
      presets: [preset, ...state.presets],
    };
  }),
  on(CoinsNavigationActions.updatePresetSuccess, (state, { preset }) => {
    const presetsTmp: Preset[] = JSON.parse(JSON.stringify(state.presets));
    const updatePresetIndex = presetsTmp.findIndex((p) => p.id === preset.id);

    if (updatePresetIndex !== -1) {
      presetsTmp.splice(updatePresetIndex, 1, preset);
    }

    return {
      ...state,
      presets: presetsTmp,
    };
  }),
  on(CoinsNavigationActions.coinDataProcessingSuccess, (state, { coins }) => {
    return {
      ...state,
      coins,
    };
  }),
);
