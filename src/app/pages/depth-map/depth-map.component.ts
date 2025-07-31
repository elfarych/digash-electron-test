import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepthMapService } from './depth-map.service';
import { DepthMapData, DepthMapSettings } from './utils/models';
import { Observable } from 'rxjs';
import { DepthMapSettingsComponent } from './components/depth-map-settings/depth-map-settings.component';
import { DepthMapAreaComponent } from './components/depth-map-area/depth-map-area.component';
import { DepthMapLoaderComponent } from './components/depth-map-loader/depth-map-loader.component';

@Component({
  selector: 'app-depth-map',
  standalone: true,
  imports: [
    CommonModule,
    DepthMapSettingsComponent,
    DepthMapAreaComponent,
    DepthMapLoaderComponent,
  ],
  templateUrl: './depth-map.component.html',
  styleUrls: ['./depth-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthMapComponent implements OnInit {
  public settings$: Observable<DepthMapSettings> = this.service.getSettings();
  public depthData$: Observable<DepthMapData> = this.service.getDepthData();
  public loading$: Observable<boolean> = this.service.getLoading();
  public coins$: Observable<{ symbol: string }[]> =
    this.service.getDepthCoins();

  constructor(private service: DepthMapService) {}

  public ngOnInit() {
    this.service.loadSettings();
  }

  public changeSettings(settings: DepthMapSettings): void {
    this.service.updateSettings(settings);
  }

  public reloadData(): void {
    this.service.loadDepthData();
  }

  public openChart({ exchange, symbol }): void {
    this.service.openChart(exchange, symbol);
  }
}
