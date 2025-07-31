import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  DepthMapCoinsData,
  DepthMapSettings,
  DepthMapSettingsApiResponse,
} from '../utils/models';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class DepthMapResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public receiveDepthMapData(markets: string[]): Observable<DepthMapCoinsData> {
    return this.http.get<DepthMapCoinsData>(
      `${this.apiGatewayService.getBaseUrl()}/orderbook/depth-map-data/`,
      {
        params: {
          markets: markets.join(','),
        },
      },
    );
  }

  public receiveDepthMapSettings(): Observable<DepthMapSettings> {
    return this.http
      .get<DepthMapSettingsApiResponse>(
        `${this.apiGatewayService.getBaseUrl()}/orderbook/depth-map-settings/`,
      )
      .pipe(map((data) => data.settings));
  }

  public updateDepthMapSettings(
    settings: DepthMapSettings,
  ): Observable<DepthMapSettings> {
    return this.http
      .put<DepthMapSettingsApiResponse>(
        `${this.apiGatewayService.getBaseUrl()}/orderbook/depth-map-settings-update/`,
        { settings },
      )
      .pipe(map((data) => data.settings));
  }
}
