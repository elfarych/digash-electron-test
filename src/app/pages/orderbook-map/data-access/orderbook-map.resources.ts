import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  OrderbookMapCoinsData,
  OrderbookMapSettings,
  OrderbookMapSettingsApiResponse,
} from '../utils/models';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class OrderbookMapResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public receiveOrderbookMapData(
    markets: string[],
  ): Observable<OrderbookMapCoinsData> {
    return this.http.get<OrderbookMapCoinsData>(
      `${this.apiGatewayService.getBaseUrl()}/orderbook/depth-map-data/`,
      {
        params: {
          markets: markets.join(','),
        },
      },
    );
  }

  public receiveOrderbookMapSettings(): Observable<OrderbookMapSettings> {
    return this.http
      .get<OrderbookMapSettingsApiResponse>(
        `${this.apiGatewayService.getBaseUrl()}/orderbook/depth-map-settings/`,
      )
      .pipe(map((data) => data.settings));
  }

  public updateOrderbookMapSettings(
    settings: OrderbookMapSettings,
  ): Observable<OrderbookMapSettings> {
    return this.http
      .put<OrderbookMapSettingsApiResponse>(
        `${this.apiGatewayService.getBaseUrl()}/orderbook/depth-map-settings-update/`,
        { settings },
      )
      .pipe(map((data) => data.settings));
  }
}
