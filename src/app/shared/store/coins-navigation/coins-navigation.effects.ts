import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { getExchangeData } from '../../models/Exchange';
import {
  CoinNavigationChartSettingsActions,
  CoinsNavigationActions,
} from './coins-navigation.actions';
import { map, mergeMap, withLatestFrom } from 'rxjs';
import { CoinsNavigationResources } from './coins-navigation.resources';
import {
  selectAllNavigationCoins,
  selectCoinsNavigationChartSettings,
  selectCoinsNavigationRawData,
  selectCoinsNavigationSettings,
} from './coins-navigation.selectors';
import { Router } from '@angular/router';
import { CoinsNavigationRawData } from '../../models/CoinsNavigationData';
import {
  convertWorkspaceToDensities,
  Density,
  DensitySortField,
  filterDensities,
  sortDensities,
} from '../../utils/densities';
import { coinsDataProcessing } from './coins-data-processing';
import { AuthActions } from '../../../auth/data-access/auth.actions';

@Injectable()
export class CoinsNavigationEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private resources: CoinsNavigationResources,
    private router: Router,
  ) {}

  private loadCoinsNavigationData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinsNavigationActions.loadCoinsNavigationData),
      mergeMap(({ exchange, forceRedirect }) =>
        this.resources.loadCoinsNavigationData(exchange).pipe(
          map((data: CoinsNavigationRawData) => {
            if (forceRedirect) {
              this.router.navigate([
                'app',
                'coins-view',
                exchange,
                Object.keys(data)[0] ??
                  getExchangeData(exchange)?.defaultCoin ??
                  'BTCUSDT',
              ]);
            }
            return CoinsNavigationActions.loadCoinsNavigationDataSuccess({
              data,
            });
          }),
        ),
      ),
    ),
  );

  private loadCoinsNavigationSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinsNavigationActions.loadCoinsNavigationSettings),
      mergeMap(() =>
        this.resources.loadCoinsNavigationSettings().pipe(
          map((settings) =>
            CoinsNavigationActions.loadCoinsNavigationSettingsSuccess({
              settings,
            }),
          ),
        ),
      ),
    ),
  );

  private updateCoinsNavigationChartSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinNavigationChartSettingsActions.updateChartSettings),
      mergeMap(({ data }) =>
        this.resources
          .updateCoinsNavigationChartSettings(data)
          .pipe(
            map(() =>
              CoinNavigationChartSettingsActions.updateChartSettingsSuccess(),
            ),
          ),
      ),
    ),
  );

  private updateCoinsNavigationChartSettingsBySorting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CoinsNavigationActions.toggleColumn,
        CoinsNavigationActions.toggleSortingByAlerts,
        CoinsNavigationActions.toggleNavigationAutoSize,
        CoinsNavigationActions.changeSortingColumn,
        CoinsNavigationActions.changeSortingType,
        CoinsNavigationActions.resetColumns,
      ),
      withLatestFrom(this.store.select(selectCoinsNavigationSettings)),
      mergeMap(([, settings]) =>
        this.resources
          .updateCoinsNavigationSettings(settings)
          .pipe(
            map(() =>
              CoinNavigationChartSettingsActions.updateChartSettingsSuccess(),
            ),
          ),
      ),
    ),
  );

  private processDensities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CoinNavigationChartSettingsActions.updateChartSettingsSuccess,
        CoinsNavigationActions.updateCoinsNavigationSuccess,
        CoinsNavigationActions.loadCoinsNavigationDataSuccess,
      ),
      withLatestFrom(
        this.store.select(selectCoinsNavigationChartSettings),
        this.store.select(selectAllNavigationCoins),
      ),
      map(([, settings, coins]) => {
        let densities: Density[] = [];

        if (settings.showDensitiesWidget && settings.showLimitOrders) {
          densities = convertWorkspaceToDensities(coins);
          densities = filterDensities(densities, {
            distance: settings.limitOrderDistance,
            size: settings.limitOrderFilter,
            lifeTime: settings.limitOrderLife,
            corrosionTime: settings.limitOrderCorrosionTime,
          });
          densities = sortDensities(
            settings.densitiesWidgetSettings.sorting as DensitySortField,
            densities,
          );
        }

        return CoinsNavigationActions.processDensitiesSuccess({ densities });
      }),
    ),
  );

  private excludeExchanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinsNavigationActions.excludeExchanges),
      withLatestFrom(this.store.select(selectCoinsNavigationChartSettings)),
      mergeMap(([{ exchanges }, settings]) =>
        this.resources
          .updateCoinsNavigationChartSettings({
            ...settings,
            excludedExchanges: exchanges,
          })
          .pipe(
            map(() =>
              CoinsNavigationActions.loadCoinsNavigationData({
                exchange: settings.market,
                forceRedirect: false,
                loading: true,
                filtering: false,
                sorting: false,
              }),
            ),
          ),
      ),
    ),
  );

  private loadPresets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CoinsNavigationActions.loadPresets,
        CoinsNavigationActions.deletePresetSuccess,
      ),
      mergeMap(() =>
        this.resources
          .getPresets()
          .pipe(
            map((presets) =>
              CoinsNavigationActions.loadPresetsSuccess({ presets }),
            ),
          ),
      ),
    ),
  );

  private createPresets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinsNavigationActions.createPreset),
      mergeMap(({ data }) =>
        this.resources
          .createPreset(data)
          .pipe(
            map((preset) =>
              CoinsNavigationActions.createPresetSuccess({ preset }),
            ),
          ),
      ),
    ),
  );

  private updatePreset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinsNavigationActions.updatePreset),
      mergeMap(({ data }) =>
        this.resources
          .updatePreset(data)
          .pipe(
            map((preset) =>
              CoinsNavigationActions.updatePresetSuccess({ preset }),
            ),
          ),
      ),
    ),
  );

  private selectPreset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinsNavigationActions.selectPreset),
      mergeMap(({ preset }) =>
        this.resources
          .selectPreset({
            ...preset,
            selected: true,
          })
          .pipe(
            map((preset) =>
              CoinsNavigationActions.selectPresetSuccess({ preset }),
            ),
          ),
      ),
    ),
  );

  private deletePreset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinsNavigationActions.deletePreset),
      mergeMap(({ id }) =>
        this.resources
          .deletePreset(id)
          .pipe(map(() => CoinsNavigationActions.deletePresetSuccess())),
      ),
    ),
  );

  private loadChartPresetSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CoinsNavigationActions.selectPresetSuccess,
        CoinsNavigationActions.createPresetSuccess,
      ),
      map(() => CoinsNavigationActions.loadCoinsNavigationSettings()),
    ),
  );

  private coinsDataProcessing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CoinsNavigationActions.loadCoinsNavigationDataSuccess,
        CoinsNavigationActions.loadCoinsNavigationSettingsSuccess,
        CoinsNavigationActions.updateCoinsNavigation,
        CoinsNavigationActions.toggleColumn,
        CoinsNavigationActions.toggleSortingByAlerts,
        CoinsNavigationActions.changeSortingType,
        CoinsNavigationActions.changeSortingColumn,
        CoinsNavigationActions.resetColumns,
        CoinNavigationChartSettingsActions.updateChartSettings,
      ),
      withLatestFrom(
        this.store.select(selectCoinsNavigationRawData),
        this.store.select(selectCoinsNavigationSettings),
        this.store.select(selectCoinsNavigationChartSettings),
      ),
      map(([, coinsData, settings, chartSettings]) => {
        return CoinsNavigationActions.coinDataProcessingSuccess({
          coins: coinsDataProcessing(coinsData, settings, chartSettings),
        });
      }),
    ),
  );

  private authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setUser),
      map(() => CoinsNavigationActions.loadCoinsNavigationSettings()),
    ),
  );
}
