import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { Exchange } from '../../models/Exchange';
import { ChartSettings } from '../../models/ChartSettings';
import { CoinData } from '../../models/CoinData';
import { CoinsNavigationRawData } from '../../models/CoinsNavigationData';
import { IGNORE_INTERCEPTOR } from '../../../core/http/error-handling.interceptor';
import { ApiGatewayService } from '../../../core/http/api-gateway.service';
import { Preset } from '../../models/Preset';
import { CoinsNavigationStateSettings } from './coins-navigation.reducer';

@Injectable({
  providedIn: 'root',
})
export class CoinsNavigationResources {
  constructor(
    private http: HttpClient,
    private apiGatewayService: ApiGatewayService,
  ) {}

  public getCoinToSwap(
    exchange: Exchange,
    symbol: string,
  ): Observable<{ symbol: string | null }> {
    return this.http.get<{ symbol: string | null }>(
      `${this.apiGatewayService.getBaseUrl()}/chart/coin-to-swap/${exchange}/${symbol}/`,
    );
  }

  public loadCoinsNavigationData(
    exchange: Exchange,
  ): Observable<CoinsNavigationRawData> {
    return this.http
      .get<CoinsNavigationRawData>(
        `${this.apiGatewayService.getBaseUrl()}/coins-navigation/data/`,
        {
          params: { exchange },
        },
      )
      .pipe(retry({ delay: 1000, count: 2 }));
  }

  public updateCoinsNavigationSettings(
    data: CoinsNavigationStateSettings,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/update-settings/`,
      data,
    );
  }

  public loadCoinsNavigationSettings(): Observable<CoinsNavigationStateSettings> {
    return this.http.get<CoinsNavigationStateSettings>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/settings/`,
    );
  }

  public loadCoinData(
    symbol: string,
    exchange: Exchange,
  ): Observable<CoinData> {
    return this.http.get<CoinData>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/coin-data/`,
      {
        context: new HttpContext().set(IGNORE_INTERCEPTOR, true),
        params: {
          exchange,
          symbol,
        },
      },
    );
  }

  public updateCoinsNavigationChartSettings(
    data: ChartSettings,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/chart-settings/`,
      { data },
    );
  }

  public getChartSettings(): Observable<ChartSettings> {
    return this.http.get<ChartSettings>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/chart-settings/`,
    );
  }

  public getPresets(): Observable<Preset[]> {
    return this.http.get<Preset[]>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/presets/`,
    );
  }

  public createPreset(data: Partial<Preset>): Observable<Preset> {
    return this.http.post<Preset>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/presets/create/`,
      { data },
    );
  }

  public updatePreset(data: Partial<Preset>): Observable<Preset> {
    return this.http.patch<Preset>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/presets/update/${data.id}/`,
      data,
    );
  }

  public selectPreset(data: Preset): Observable<Preset> {
    return this.http.put<Preset>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/presets/select/${data.id}/`,
      { data },
    );
  }

  public deletePreset(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/presets/delete/${id}/`,
    );
  }
}
