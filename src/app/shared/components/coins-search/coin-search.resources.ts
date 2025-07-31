import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CoinModel } from './utils/coin.model';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({ providedIn: 'root' })
export class CoinSearchResources {
  constructor(
    private http: HttpClient,
    private apiGatewayService: ApiGatewayService
  ) {}

  public receiveCoins(search: string): Observable<CoinModel[]> {
    return this.http.get<CoinModel[]>(
      `${this.apiGatewayService.getBaseUrl()}/chart/coins/?search=${search}`,
    );
  }
}
