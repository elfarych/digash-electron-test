import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertNotification } from '../../models/Notification';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IGNORE_INTERCEPTOR } from '../../../core/http/error-handling.interceptor';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class NotificationsResources {
  public requestNotifications(): Observable<AlertNotification[]> {
    return this.httpClient.get<AlertNotification[]>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/notifications/`,
      {
        context: new HttpContext().set(IGNORE_INTERCEPTOR, true),
      },
    );
  }

  public requestViewAll(): Observable<AlertNotification[]> {
    return this.httpClient.get<AlertNotification[]>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/notifications/watch/all/`,
    );
  }

  public requestRemoveAll(alertId: number): Observable<AlertNotification[]> {
    return this.httpClient.get<AlertNotification[]>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/${alertId}/notifications/remove/all/`,
    );
  }

  public requestView(notificationId: number): Observable<{}> {
    return this.httpClient.get<{}>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/notifications/${notificationId}/watch/`,
      { context: new HttpContext().set(IGNORE_INTERCEPTOR, true) },
    );
  }

  public triggerAlertNotification(alertId: number): Observable<{}> {
    return this.httpClient.get<{}>(
      `${this.apiGatewayService.getBaseUrl()}/alerts/notifications/trigger/${alertId}/`,
    );
  }

  constructor(private httpClient: HttpClient, private apiGatewayService: ApiGatewayService) {}
}
