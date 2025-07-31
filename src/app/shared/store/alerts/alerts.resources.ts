import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Alert } from '../../models/Alert';
import { AlertSettings } from '../../models/AlertSettings';
import { IGNORE_INTERCEPTOR } from '../../../core/http/error-handling.interceptor';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class AlertsResources {
  constructor(
    private httpClient: HttpClient,
    private apiGatewayService: ApiGatewayService
  ) {}

  public getAlertsSettings(): Observable<AlertSettings> {
    return this.httpClient.get<AlertSettings>(
      `${this.apiGatewayService.getBaseUrl()}/user/alerts/`,
    );
  }R

  public updateAlertsSettings(data: AlertSettings): Observable<AlertSettings> {
    return this.httpClient.put<AlertSettings>(
      `${this.apiGatewayService.getBaseUrl()}/user/alerts/`,
      data,
    );
  }

  public getAlerts(): Observable<Alert[]> {
    return this.httpClient.get<Alert[]>(`${this.apiGatewayService.getBaseUrl()}/alerts/`, {
      context: new HttpContext().set(IGNORE_INTERCEPTOR, true),
    });
  }

  public createAlert(data: Alert): Observable<Alert> {
    return this.httpClient.post<Alert>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/create/`,
      data,
    );
  }

  public updateAlert(data: Alert, alertId: number): Observable<Alert> {
    return this.httpClient.put<Alert>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/update/${alertId}/`,
      data,
    );
  }

  public remove(alertId: number): Observable<Alert[]> {
    return this.httpClient.delete<Alert[]>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/remove/${alertId}/`,
    );
  }

  public activate(alertId: number): Observable<{}> {
    return this.httpClient.put<{}>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/${alertId}/activate/`,
      { alertId },
    );
  }

  public deactivate(alertId: number): Observable<{}> {
    return this.httpClient.put<{}>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/${alertId}/deactivate/`,
      { alertId },
    );
  }

  public removeAllInactiveAlerts(): Observable<Alert[]> {
    return this.httpClient.delete<Alert[]>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/remove-inactive-price/`,
    );
  }
}
