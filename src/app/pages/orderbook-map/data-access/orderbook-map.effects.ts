import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { OrderbookMapActions } from '../../orderbook-map/data-access/orderbook-map.actions';
import { OrderbookMapResources } from '../../orderbook-map/data-access/orderbook-map.resources';
import { getOrderbookMapDefaultSettings } from '../../orderbook-map/utils/defaultSettings';
import {
  OrderbookMapCoinsData,
  OrderbookMapSettings,
} from '../../orderbook-map/utils/models';
import { normalizeOrderbookMapData } from '../../orderbook-map/utils/normalize';

import {
  catchError,
  EMPTY,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { getOrderbookMapActiveExchangesList } from '../utils/activeExchanges';
import { selectOrderbookMapSettings } from './orderbook-map.selectors';

@Injectable({
  providedIn: 'root',
})
export class OrderbookMapEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private resources: OrderbookMapResources,
  ) {}

  private loadOrderbookData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        OrderbookMapActions.loadSettingsSuccess,
        OrderbookMapActions.loadOrderbookData,
      ),
      withLatestFrom(this.store.select(selectOrderbookMapSettings)),
      switchMap(([, settings]) =>
        this.resources
          .receiveOrderbookMapData(getOrderbookMapActiveExchangesList(settings))
          .pipe(
            map((data: OrderbookMapCoinsData) =>
              OrderbookMapActions.loadOrderbookDataSuccess({
                data: normalizeOrderbookMapData(data, settings),
                coinsData: data,
              }),
            ),
            catchError((error) => {
              OrderbookMapActions.loadOrderbookDataError({
                errorMessage: error.error,
              });
              return EMPTY;
            }),
          ),
      ),
    ),
  );

  private loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderbookMapActions.loadSettings),
      switchMap(() =>
        this.resources.receiveOrderbookMapSettings().pipe(
          map((data: OrderbookMapSettings) => {
            if (Object.keys(data).length) {
              return OrderbookMapActions.loadSettingsSuccess({ data });
            } else {
              return OrderbookMapActions.updateSettings({
                data: getOrderbookMapDefaultSettings(),
              });
            }
          }),
          catchError((error) => {
            OrderbookMapActions.loadSettingsError({
              errorMessage: error.error,
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderbookMapActions.updateSettings),
      switchMap(({ data }) =>
        this.resources.updateOrderbookMapSettings(data).pipe(
          mergeMap((data: OrderbookMapSettings) => [
            OrderbookMapActions.updateSettingsSuccess({ data })
          ]),
          catchError((error) => {
            OrderbookMapActions.updateSettingsError({
              errorMessage: error.error,
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );
}
