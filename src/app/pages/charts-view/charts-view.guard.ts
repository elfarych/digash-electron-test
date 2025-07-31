import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { getExchangeData } from '../../shared/models/Exchange';
import { CoinsNavigationResources } from '../../shared/store/coins-navigation/coins-navigation.resources';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { CoinNavigationChartSettingsActions } from '../../shared/store/coins-navigation/coins-navigation.actions';
import { CoinsNavigationService } from '../../shared/store/coins-navigation/coins-navigation.service';
import { defaultChartSettings } from '../../shared/models/ChartSettings';

@Injectable({
  providedIn: 'root',
})
export class ChartsViewGuard implements CanActivate {
  constructor(
    private router: Router,
    private coinsNavigationResources: CoinsNavigationResources,
    private coinsNavigationService: CoinsNavigationService,
    private store: Store,
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    let chartSettings = defaultChartSettings;

    try {
      const chartSettingsStore = await firstValueFrom(
        this.coinsNavigationService.getChartSettings(),
      );

      chartSettings = chartSettingsStore
        ? chartSettingsStore
        : await firstValueFrom(
            this.coinsNavigationResources.getChartSettings(),
          );

      if (!chartSettingsStore) {
        this.store.dispatch(
          CoinNavigationChartSettingsActions.loadChartSettingsSuccess({
            data: chartSettings,
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }

    if (route.params['exchange'] && route.params['symbol']) {
      return true;
    }

    const symbol = chartSettings.market
      ? getExchangeData(chartSettings.market)?.defaultCoin
      : 'BTCUSDT';

    return this.router.navigate([
      `app/coins-view/${chartSettings.market ?? 'BINANCE_SPOT'}/${symbol}`,
    ]);
  }
}
