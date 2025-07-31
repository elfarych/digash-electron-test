import { createReducer, on } from '@ngrx/store';
import {
  getEmptyOrderbookMapData,
  OrderbookMapCoinsData,
  OrderbookMapData,
  OrderbookMapSettings,
} from '../utils/models';
import { OrderbookMapActions } from './orderbook-map.actions';
import {normalizeOrderbookMapData} from "../utils/normalize";
import {DepthMapCoinsData} from "../../depth-map/utils/models";

export interface OrderbookMapState {
  orderbookData: OrderbookMapData;
  settings: OrderbookMapSettings;
  pageLoading: boolean;
  loading: boolean;
  errorMessage?: string;
  coinsData: OrderbookMapCoinsData;
}

export const initialOrderBookMapState: OrderbookMapState = {
  orderbookData: getEmptyOrderbookMapData(),
  pageLoading: true,
  loading: false,
  errorMessage: undefined,
  settings: undefined,
  coinsData: undefined,
};

export const orderbookMapReducer = createReducer(
  initialOrderBookMapState,

  on(
    OrderbookMapActions.loadOrderbookDataSuccess,
    (state, { data: orderbookData, coinsData }) => ({
      ...state,
      orderbookData,
      coinsData,
      pageLoading: false,
    }),
  ),

  on(
    OrderbookMapActions.loadSettingsSuccess,
    OrderbookMapActions.updateSettings,
    OrderbookMapActions.updateSettingsSuccess,
    (state, { data: settings }) => {
      const updSettings = JSON.parse(JSON.stringify(settings));
      if (!('displayLargeCirce' in updSettings)) {
        updSettings.displayLargeCirce = true;
      }
      if (!('largeCircleDistance' in updSettings)) {
        updSettings.largeCircleDistance = 3;
      }
      if (!('displaySmallCircle' in updSettings)) {
        updSettings.displaySmallCircle = true;
      }
      if (!('smallCircleDistance' in updSettings)) {
        updSettings.smallCircleDistance = 1;
      }

      const orderbookDataTmp: DepthMapCoinsData = JSON.parse(JSON.stringify(state?.coinsData ?? {}));

      return {
        ...state,
        settings: updSettings,
        orderbookData: normalizeOrderbookMapData(orderbookDataTmp, settings)
      }
    },
  ),

  on(
    OrderbookMapActions.loadOrderbookData,
    OrderbookMapActions.loadSettings,
    OrderbookMapActions.updateSettings,
    (state) => ({
      ...state,
      loading: true,
    }),
  ),

  on(
    OrderbookMapActions.loadOrderbookDataSuccess,
    OrderbookMapActions.loadSettingsSuccess,
    OrderbookMapActions.updateSettingsSuccess,
    (state) => ({
      ...state,
      loading: false,
    }),
  ),

  on(
    OrderbookMapActions.loadOrderbookDataError,
    OrderbookMapActions.loadSettingsError,
    OrderbookMapActions.updateSettingsError,
    (state, { errorMessage }) => ({
      ...state,
      loading: false,
      errorMessage,
    }),
  ),
);
