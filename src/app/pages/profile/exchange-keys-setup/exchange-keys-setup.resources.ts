import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ExchangeApiConnectResponse,
  ExchangeKeysSetupPayload,
} from './utils/exchange-keys-setup.models';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({ providedIn: 'root' })
export class ExchangeKeysSetupResources {
  constructor(private readonly http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public connectBinanceAccount(
    payload: ExchangeKeysSetupPayload,
  ): Observable<ExchangeApiConnectResponse> {
    return this.http.post<ExchangeApiConnectResponse>(
      `${this.apiGatewayService.getBaseUrl()}/user/binance/api-connect/`,
      payload,
    );
  }

  public deleteBinanceAccount(): Observable<{}> {
    return this.http.delete<{}>(
      `${this.apiGatewayService.getBaseUrl()}/user/binance/api-disconnect/`,
    );
  }
}
