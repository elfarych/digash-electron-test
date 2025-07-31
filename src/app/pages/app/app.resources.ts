import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {ApiGatewayService} from "../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class AppResources {
  constructor(
    private httpClient: HttpClient,
    private apiGatewayService: ApiGatewayService
  ) {}

  public ping(): Observable<{}> {
    return this.httpClient.get<{}>(`${this.apiGatewayService.getBaseUrl()}/user/ping/`);
  }
}
