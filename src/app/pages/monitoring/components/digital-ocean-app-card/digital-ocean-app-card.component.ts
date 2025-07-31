import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalOceanApp } from '../../utils/models/DigitalOcean';
import { MonitoringPermission } from '../../utils/models/Permissions';

@Component({
  selector: 'app-digital-ocean-app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './digital-ocean-app-card.component.html',
  styleUrls: ['./digital-ocean-app-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalOceanAppCardComponent {
  @Input()
  public app: DigitalOceanApp;

  @Input()
  public permissions: MonitoringPermission = { is_admin: false };

  @Output()
  public restartApp: EventEmitter<string> = new EventEmitter<string>();

  private dangerLoadValue = 100;
  private warningLoadValue = 95;

  public get appCardClass(): string {
    if (!this.app.is_available) {
      return 'danger';
    }

    if (!this.permissions.is_admin) {
      return 'positive';
    }

    if (this.app.current_load >= this.warningLoadValue) {
      return 'warning';
    }
    return '';
  }

  public get appCardHighLoadClass(): string {
    if (this.app.high_load >= this.dangerLoadValue) {
      return 'danger';
    }

    if (this.app.high_load >= this.warningLoadValue) {
      return 'warning';
    }

    return '';
  }

  public get appName(): string {
    if (this.permissions.is_admin) {
      return this.app.name;
    }

    if (this.app.name.toLowerCase().includes('depth')) {
      if (this.app.name.toLowerCase().includes('processing')) {
        return 'Orderbook processing server';
      }
      return 'Orderbook data server';
    }
    if (this.app.name.toLowerCase().includes('kline')) {
      if (this.app.name.toLowerCase().includes('processing')) {
        return 'Kline processing server';
      }
      return 'Kline data server';
    }

    if (this.app.name.toLowerCase().includes('footprints')) {
      return 'Trades data server';
    }

    return 'Data server';
  }
}
