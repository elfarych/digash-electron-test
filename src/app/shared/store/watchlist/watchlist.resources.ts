import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Watchlist } from '../../models/Watchlist';
import { environment } from '../../../../environments/environment';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class WatchlistResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public loadWatchlist(): Observable<{ data: Watchlist }> {
    return this.http.get<{ data: Watchlist }>(
      `${this.apiGatewayService.getBaseUrl()}/watchlist/`,
    );
  }

  public updateWatchlist(data: Watchlist): Observable<{ data: Watchlist }> {
    return this.http.put<{ data: Watchlist }>(
      `${this.apiGatewayService.getBaseUrl()}/watchlist/`,
      { data },
    );
  }
}
