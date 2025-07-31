import { Injectable } from '@angular/core';
import {
  AppFunctionTooltip,
  AppFunctionTooltipIdentifier,
} from './utils/tooltip.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({ providedIn: 'root' })
export class TooltipsResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public receiveAppFunctionTooltip(
    identifier: AppFunctionTooltipIdentifier,
  ): Observable<AppFunctionTooltip> {
    return this.http.get<AppFunctionTooltip>(
      `${this.apiGatewayService.getBaseUrl()}/tooltips/app-function-tooltips/${identifier}/`,
    );
  }
}
