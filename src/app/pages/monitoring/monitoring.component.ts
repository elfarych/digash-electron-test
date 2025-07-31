import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { DropdownModule } from 'primeng/dropdown';
import { firstValueFrom, Observable } from 'rxjs';
import { DigitalOceanAppCardComponent } from './components/digital-ocean-app-card/digital-ocean-app-card.component';
import { MonitoringService } from './monitoring.service';
import { DigitalOceanApp } from './utils/models/DigitalOcean';
import {
  Exchange,
  ExchangeData,
  getMainExchangesData,
} from '../../shared/models/Exchange';
import { MonitoringPermission } from './utils/models/Permissions';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    DigitalOceanAppCardComponent,
    DropdownModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    SvgIconComponent,
  ],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringComponent implements OnInit {
  public digitalOceanApps: DigitalOceanApp[] = [];
  public processedApps: DigitalOceanApp[] = [];
  public permissions$: Observable<MonitoringPermission> =
    this.service.getPermissions();

  public sortDirection: 'current' | 'high' = 'current';
  public appsFilter: 'all' | 'app' | 'droplet' = 'all';
  public updateInProcess: boolean = false;
  public sortingDropdownOptions = [
    { label: 'Current', value: 'current' },
    { label: 'High', value: 'high' },
  ];
  public filterDropdownOptions = [
    { label: 'All', value: 'all' },
    { label: 'Apps', value: 'app' },
    { label: 'Droplets', value: 'droplet' },
  ];

  public groupAppsByExchange: boolean = true;

  public exchanges: ExchangeData[] = getMainExchangesData();

  constructor(
    private service: MonitoringService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.loadApps();
  }

  public getAppsByExchange(exchange: Exchange): DigitalOceanApp[] {
    const exchangeData: ExchangeData = this.exchanges.find(
      (e) => e.exchange === exchange,
    );
    return this.processedApps.filter((app) =>
      app.name.toLowerCase().includes(exchangeData.monitoringAppKey),
    );
  }

  public async loadApps(): Promise<void> {
    this.digitalOceanApps = await firstValueFrom(
      this.service.getDigitalOceanApps(),
    );
    this.processApps();
  }

  public async reloadApps(): Promise<void> {
    this.updateInProcess = true;
    this.cdr.detectChanges();
    this.digitalOceanApps = await firstValueFrom(
      this.service.reloadOceanApps(),
    );
    this.updateInProcess = false;
    this.processApps();
  }

  public onFilterChange(): void {
    this.filterApps();
    this.cdr.detectChanges();
  }

  public onSortingChange(): void {
    this.sortApps();
    this.cdr.detectChanges();
  }

  public async restartApp(appId: string): Promise<void> {
    const res = await firstValueFrom(
      this.service.restartDigitalOceanApp(appId),
    );
    console.log(res);
  }

  private processApps(): void {
    this.filterApps();
    this.sortApps();
    this.cdr.detectChanges();
  }

  private filterApps(): void {
    if (this.appsFilter === 'app') {
      this.processedApps = this.digitalOceanApps.filter(
        (a) => a.type === 'app',
      );
    } else if (this.appsFilter === 'droplet') {
      this.processedApps = this.digitalOceanApps.filter(
        (a) => a.type === 'droplet',
      );
    } else {
      this.processedApps = JSON.parse(JSON.stringify(this.digitalOceanApps));
    }
  }

  private sortApps(): void {
    if (this.sortDirection === 'current') {
      this.processedApps = this.digitalOceanApps.sort(
        (a, b) => b.current_load - a.current_load,
      );
    }

    if (this.sortDirection === 'high') {
      this.processedApps = this.digitalOceanApps.sort(
        (a, b) => b.high_load - a.high_load,
      );
    }
    this.processedApps = this.processedApps.sort((a) =>
      a.is_available ? 1 : -1,
    );
  }
}
