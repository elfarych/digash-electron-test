import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DepthMapResources } from './depth-map.resources';
import {
  catchError,
  EMPTY,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { DepthMapActions } from './depth-map.actions';
import { DepthMapCoinsData, DepthMapSettings } from '../utils/models';
import { selectDepthMapSettings } from './depth-map.selectors';
import { getDepthMapActiveExchangesList } from '../utils/activeExchanges';
import { getDepthMapDefaultSettings } from '../utils/defaultSettings';
import { normalizeDepthMapData } from '../utils/norimailizeData';

@Injectable({
  providedIn: 'root',
})
export class DepthMapEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private resources: DepthMapResources,
  ) {}

  private loadDeptData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DepthMapActions.loadSettingsSuccess,
        DepthMapActions.updateSettingsSuccess,
        DepthMapActions.loadDepthData,
      ),
      withLatestFrom(this.store.select(selectDepthMapSettings)),
      switchMap(([, settings]) =>
        this.resources
          .receiveDepthMapData(getDepthMapActiveExchangesList(settings))
          .pipe(
            map((data: DepthMapCoinsData) =>
              DepthMapActions.loadDepthDataSuccess({
                data: normalizeDepthMapData(data, settings),
                coinsData: data,
              }),
            ),
            catchError((error) => {
              DepthMapActions.loadDepthDataError({ errorMessage: error.error });
              return EMPTY;
            }),
          ),
      ),
    ),
  );

  private loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepthMapActions.loadSettings),
      switchMap(() =>
        this.resources.receiveDepthMapSettings().pipe(
          map((data: DepthMapSettings) => {
            if (Object.keys(data).length) {
              return DepthMapActions.loadSettingsSuccess({ data });
            } else {
              return DepthMapActions.updateSettings({
                data: getDepthMapDefaultSettings(),
              });
            }
          }),
          catchError((error) => {
            DepthMapActions.loadSettingsError({ errorMessage: error.error });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepthMapActions.updateSettings),
      switchMap(({ data }) =>
        this.resources.updateDepthMapSettings(data).pipe(
          mergeMap((data: DepthMapSettings) => [
            DepthMapActions.updateSettingsSuccess({ data }),
            DepthMapActions.loadDepthData(),
          ]),
          catchError((error) => {
            DepthMapActions.updateSettingsError({ errorMessage: error.error });
            return EMPTY;
          }),
        ),
      ),
    ),
  );
}
