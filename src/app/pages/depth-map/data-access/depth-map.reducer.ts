import { createReducer, on } from '@ngrx/store';
import {
  DepthMapCoinsData,
  DepthMapData,
  DepthMapSettings,
  getEmptyDepthMapData,
} from '../utils/models';
import { DepthMapActions } from './depth-map.actions';

export interface DepthMapState {
  depthData: DepthMapData;
  settings: DepthMapSettings;
  loading: boolean;
  errorMessage?: string;
  coinsData: DepthMapCoinsData;
}

export const initialDepthMapState: DepthMapState = {
  depthData: getEmptyDepthMapData(),
  loading: false,
  errorMessage: undefined,
  settings: undefined,
  coinsData: undefined,
};

export const depthMapReducer = createReducer(
  initialDepthMapState,

  on(
    DepthMapActions.loadDepthDataSuccess,
    (state, { data: depthData, coinsData }) => ({
      ...state,
      depthData,
      coinsData,
    }),
  ),

  on(
    DepthMapActions.loadSettingsSuccess,
    DepthMapActions.updateSettingsSuccess,
    (state, { data: settings }) => ({
      ...state,
      settings,
    }),
  ),

  on(
    DepthMapActions.loadDepthData,
    DepthMapActions.loadSettings,
    DepthMapActions.updateSettings,
    (state) => ({
      ...state,
      loading: true,
    }),
  ),

  on(
    DepthMapActions.loadDepthDataSuccess,
    DepthMapActions.loadSettingsSuccess,
    DepthMapActions.updateSettingsSuccess,
    (state) => ({
      ...state,
      loading: false,
    }),
  ),

  on(
    DepthMapActions.loadDepthDataError,
    DepthMapActions.loadSettingsError,
    DepthMapActions.updateSettingsError,
    (state, { errorMessage }) => ({
      ...state,
      loading: false,
      errorMessage,
    }),
  ),
);
