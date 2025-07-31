import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Exchange } from '../../models/Exchange';
import { UserTradesProcessedData } from './user-trades-data.models';

@Injectable({ providedIn: 'root' })
export abstract class UserTradesDataResources {
  constructor(private readonly http: HttpClient) {}

  public getTrades(
    symbol: string,
    exchange: Exchange,
    endTime: number,
  ): Observable<UserTradesProcessedData[]> {
    return this.http.get<UserTradesProcessedData[]>(
      `${environment.userTradesProxyUrl}/trades`,
      {
        params: {
          symbol,
          exchange,
          endTime,
        },
      },
    );
  }
}
