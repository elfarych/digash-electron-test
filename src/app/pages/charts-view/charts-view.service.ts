import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Preferences } from '../../shared/models/Preferences';
import { PreferencesService } from '../../shared/components/preferences/data-access/preferences.service';
import { CoinsNavigationService } from '../../shared/store/coins-navigation/coins-navigation.service';
import { ChartTechnicalIndicators } from 'src/app/shared/models/chart-indicators/ChartIndicators';

@Injectable({
  providedIn: 'root',
})
export class ChartsViewService {
  constructor(
    private preferencesService: PreferencesService,
    private coinsNavigationService: CoinsNavigationService,
  ) {}

  public getPreferences(): Observable<Preferences> {
    return this.preferencesService.preferences$;
  }

  public getChartIndicators(): Observable<ChartTechnicalIndicators[]> {
    return this.coinsNavigationService.getChartIndicators();
  }
}
