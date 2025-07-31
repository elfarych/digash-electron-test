import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MonitoringResources } from './data-access/monitoring.resources';
import { DigitalOceanApp } from './utils/models/DigitalOcean';
import { MonitoringPermission } from './utils/models/Permissions';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  constructor(private resources: MonitoringResources) {}

  public getPermissions(): Observable<MonitoringPermission> {
    return this.resources.getPermissions();
  }

  public getDigitalOceanApps(): Observable<DigitalOceanApp[]> {
    return this.resources.getDigitalOceanApps();
  }

  public reloadOceanApps(): Observable<DigitalOceanApp[]> {
    return this.resources.reloadDigitalOceanApps();
  }

  public restartDigitalOceanApp(
    appId: string,
  ): Observable<{ status: boolean }> {
    return this.resources.restartDigitalOceanApp(appId);
  }
}
