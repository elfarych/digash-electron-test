// import { Injectable } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { getExchangeData } from '../../models/Exchange';
// import {
//   coinsDataProcessing,
//   getWorkspaceCoinsFromData,
// } from './coins-data-processing';
// import {
//   CoinNavigationChartSettingsActions,
//   CoinsNavigationActions,
// } from './coins-navigation.actions';
// import { map, mergeMap, withLatestFrom } from 'rxjs';
// import { CoinsNavigationResources } from './coins-navigation.resources';
// import {
//   selectAllNavigationCoins,
//   selectCoinsNavigationChartSettings,
//   selectCoinsNavigationFeature,
//   selectCoinsNavigationInitialData,
//   selectCoinsNavigationSettings,
// } from './coins-navigation.selectors';
// import { initialCoinsNavigation } from './coins-navigation.reducer';
// import { Router } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
// import { CoinsNavigationData } from '../../models/CoinsNavigationData';
// import {
//   convertWorkspaceToDensities,
//   Density,
//   DensitySortField,
//   filterDensities,
//   sortDensities,
// } from '../../utils/densities';
//
// @Injectable()
// export class CoinsNavigationEffectsLegacy {
//   constructor(
//     private store: Store,
//     private actions$: Actions,
//     private resources: CoinsNavigationResources,
//     private router: Router,
//     private translateService: TranslateService,
//   ) {}
//
//   private loadCoinsNavigationData$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinsNavigationActions.loadCoinsNavigation),
//       mergeMap(({ exchange, sorting, filtering, forceRedirect }) =>
//         this.resources
//           .loadCoinsNavigationData(exchange, sorting, filtering)
//           .pipe(
//             map((data: CoinsNavigationData) => {
//               const coins = coinsDataProcessing(
//                 data.data,
//                 data.settings,
//                 data.chartSettings,
//               );
//               if (forceRedirect) {
//                 this.router.navigate([
//                   'app',
//                   'coins-view',
//                   exchange,
//                   coins[0]?.symbol ??
//                     getExchangeData(exchange)?.defaultCoin ??
//                     'BTCUSDT',
//                 ]);
//               }
//               return CoinsNavigationActions.loadCoinsNavigationSuccess({
//                 settings: data.settings,
//                 coins: coins,
//                 allCoins: getWorkspaceCoinsFromData(data.data),
//                 sorting: !!data.sorting,
//                 initialCoinsNavigationData: data,
//               });
//             }),
//           ),
//       ),
//     ),
//   );
//
//   private updateCoinsNavigationData$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinsNavigationActions.updateCoinsNavigation),
//       withLatestFrom(
//         this.store.select(selectCoinsNavigationSettings),
//         this.store.select(selectCoinsNavigationInitialData),
//       ),
//       mergeMap(([{ data }, settings, selectCoinsNavigationInitialData]) =>
//         this.resources.updateCoinsNavigation(data, settings.exchange).pipe(
//           map((data) =>
//             CoinsNavigationActions.updateCoinsNavigationSuccess({
//               coins: coinsDataProcessing(
//                 selectCoinsNavigationInitialData.data,
//                 data.settings,
//                 data.chartSettings,
//               ),
//             }),
//           ),
//         ),
//       ),
//     ),
//   );
//
//   private resetNavigationColumns$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinsNavigationActions.resetColumns),
//       withLatestFrom(
//         this.store.select(selectCoinsNavigationSettings),
//         this.store.select(selectCoinsNavigationInitialData),
//       ),
//       mergeMap(([, settings, coinsNavigationInitialData]) =>
//         this.resources
//           .updateCoinsNavigation(
//             { ...settings, columns: initialCoinsNavigation.settings.columns },
//             settings.exchange,
//           )
//           .pipe(
//             mergeMap((data) => [
//               CoinsNavigationActions.updateCoinsNavigationSuccess({
//                 coins: coinsDataProcessing(
//                   coinsNavigationInitialData.data,
//                   data.settings,
//                   data.chartSettings,
//                 ),
//               }),
//               CoinsNavigationActions.resetColumnsSuccess(),
//             ]),
//           ),
//       ),
//     ),
//   );
//
//   private updateCoinsNavigationDataAfterSettingsUpdated$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinNavigationChartSettingsActions.updateChartSettingsSuccess),
//       withLatestFrom(
//         this.store.select(selectCoinsNavigationSettings),
//         this.store.select(selectCoinsNavigationInitialData),
//       ),
//       mergeMap(([, settings, coinsNavigationInitialData]) =>
//         this.resources.updateCoinsNavigation(settings, settings.exchange).pipe(
//           map((data) => {
//             const coins = coinsDataProcessing(
//               coinsNavigationInitialData.data,
//               data.settings,
//               data.chartSettings,
//             );
//             return CoinsNavigationActions.updateCoinsNavigationSuccess({
//               coins,
//             });
//           }),
//         ),
//       ),
//     ),
//   );
//
//   private updateCoinsNavigationChartSettings$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinNavigationChartSettingsActions.updateChartSettings),
//       mergeMap(({ data }) =>
//         this.resources
//           .updateCoinsNavigationChartSettings(data)
//           .pipe(
//             map(() =>
//               CoinNavigationChartSettingsActions.updateChartSettingsSuccess(),
//             ),
//           ),
//       ),
//     ),
//   );
//
//   private updateCoinsNavigationColumns$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(
//         CoinsNavigationActions.toggleColumn,
//         CoinsNavigationActions.changeSortingColumn,
//         CoinsNavigationActions.toggleSortingByAlerts,
//         CoinsNavigationActions.toggleNavigationAutoSize,
//       ),
//       withLatestFrom(this.store.select(selectCoinsNavigationFeature)),
//       map(([, { settings }]) =>
//         CoinsNavigationActions.updateCoinsNavigation({ data: settings }),
//       ),
//     ),
//   );
//
//   private processDensities$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(
//         CoinNavigationChartSettingsActions.updateChartSettingsSuccess,
//         CoinsNavigationActions.updateCoinsNavigationSuccess,
//         CoinsNavigationActions.loadCoinsNavigationSuccess,
//       ),
//       withLatestFrom(
//         this.store.select(selectCoinsNavigationChartSettings),
//         this.store.select(selectAllNavigationCoins),
//       ),
//       map(([, settings, coins]) => {
//         let densities: Density[] = [];
//
//         if (settings.showDensitiesWidget && settings.showLimitOrders) {
//           densities = convertWorkspaceToDensities(coins);
//           densities = filterDensities(densities, {
//             distance: settings.limitOrderDistance,
//             size: settings.limitOrderFilter,
//             lifeTime: settings.limitOrderLife,
//             corrosionTime: settings.limitOrderCorrosionTime,
//           });
//           densities = sortDensities(
//             settings.densitiesWidgetSettings.sorting as DensitySortField,
//             densities,
//           );
//         }
//
//         return CoinsNavigationActions.processDensitiesSuccess({ densities });
//       }),
//     ),
//   );
//
//   private excludeExchanges$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinsNavigationActions.excludeExchanges),
//       withLatestFrom(this.store.select(selectCoinsNavigationChartSettings)),
//       mergeMap(([{ exchanges }, settings]) =>
//         this.resources
//           .updateCoinsNavigationChartSettings({
//             ...settings,
//             excludedExchanges: exchanges,
//           })
//           .pipe(
//             map(() =>
//               CoinsNavigationActions.loadCoinsNavigation({
//                 exchange: settings.market,
//                 sorting: true,
//                 filtering: true,
//                 forceRedirect: false,
//               }),
//             ),
//           ),
//       ),
//     ),
//   );
//
//   private loadPresets$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(
//         CoinsNavigationActions.loadPresets,
//         CoinsNavigationActions.deletePresetSuccess,
//       ),
//       mergeMap(() =>
//         this.resources
//           .getPresets()
//           .pipe(
//             map((presets) =>
//               CoinsNavigationActions.loadPresetsSuccess({ presets }),
//             ),
//           ),
//       ),
//     ),
//   );
//
//   private createPresets$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinsNavigationActions.createPreset),
//       mergeMap(({ data }) =>
//         this.resources
//           .createPreset(data)
//           .pipe(
//             map((preset) =>
//               CoinsNavigationActions.createPresetSuccess({ preset }),
//             ),
//           ),
//       ),
//     ),
//   );
//
//   private selectPreset$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinsNavigationActions.selectPreset),
//       mergeMap(({ preset }) =>
//         this.resources
//           .selectPreset({
//             ...preset,
//             selected: true,
//           })
//           .pipe(
//             map((preset) =>
//               CoinsNavigationActions.selectPresetSuccess({ preset }),
//             ),
//           ),
//       ),
//     ),
//   );
//
//   private deletePreset$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinsNavigationActions.deletePreset),
//       mergeMap(({ id }) =>
//         this.resources
//           .deletePreset(id)
//           .pipe(map(() => CoinsNavigationActions.deletePresetSuccess())),
//       ),
//     ),
//   );
//
//   private loadChartPresetSettings$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(
//         CoinsNavigationActions.selectPresetSuccess,
//         CoinsNavigationActions.createPresetSuccess,
//       ),
//       withLatestFrom(this.store.select(selectCoinsNavigationChartSettings)),
//       map(([, settings]) => {
//         return CoinsNavigationActions.loadCoinsNavigation({
//           exchange: settings.market,
//           sorting: true,
//           forceRedirect: false,
//           filtering: true,
//         });
//       }),
//     ),
//   );
//
//   private loadChartSettings$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(CoinNavigationChartSettingsActions.loadChartSettings),
//       mergeMap(() =>
//         this.resources.getChartSettings().pipe(
//           map((data) =>
//             CoinNavigationChartSettingsActions.loadChartSettingsSuccess({
//               data,
//             }),
//           ),
//         ),
//       ),
//     ),
//   );
// }
