import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DigitalOceanApp } from '../utils/models/DigitalOcean';
import { MonitoringPermission } from '../utils/models/Permissions';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({ providedIn: 'root' })
export class MonitoringResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public getPermissions(): Observable<MonitoringPermission> {
    return this.http.get<MonitoringPermission>(
      `${this.apiGatewayService.getBaseUrl()}/monitoring/permissions/`,
    );
  }

  public getDigitalOceanApps(): Observable<DigitalOceanApp[]> {
    return this.http.get<DigitalOceanApp[]>(
      `${this.apiGatewayService.getBaseUrl()}/monitoring/digital-ocean/apps/`,
    );
  }

  public reloadDigitalOceanApps(): Observable<DigitalOceanApp[]> {
    return this.http.get<DigitalOceanApp[]>(
      `${this.apiGatewayService.getBaseUrl()}/monitoring/digital-ocean/apps/reload/`,
    );
  }

  public restartDigitalOceanApp(
    appId: string,
  ): Observable<{ status: boolean }> {
    return this.http.get<{ status: boolean }>(
      `${this.apiGatewayService.getBaseUrl()}/monitoring/digital-ocean/apps/restart/${appId}/`,
    );
  }
}
