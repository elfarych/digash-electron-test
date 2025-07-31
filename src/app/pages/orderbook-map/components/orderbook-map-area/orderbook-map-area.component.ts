import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../../../../shared/models/Alert';
import { ChartSettings } from '../../../../shared/models/ChartSettings';
import { Exchange } from '../../../../shared/models/Exchange';
import { Preferences } from '../../../../shared/models/Preferences';
import {
  OrderbookMapCoinsData,
  OrderbookMapData,
  OrderbookMapSettings,
} from '../../utils/models';
import { OrderbookMapOrdersComponent } from '../orderbook-map-orders/orderbook-map-orders.component';

@Component({
  selector: 'app-orderbook-map-area',
  standalone: true,
  imports: [CommonModule, OrderbookMapOrdersComponent],
  templateUrl: './orderbook-map-area.component.html',
  styleUrls: ['./orderbook-map-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderbookMapAreaComponent {
  @Input()
  public orderBookMapData: OrderbookMapData;

  @Input()
  public size: 1 | 2 = 1;

  @Input()
  public settings: OrderbookMapSettings;

  @Output()
  public openChart: EventEmitter<{ exchange: Exchange; symbol: string }> = new EventEmitter<{ exchange: Exchange; symbol: string }>();

  @Input()
  public preferences: Preferences;

  @Input()
  public chartSettings: ChartSettings;

  @Input()
  public coinsData: OrderbookMapCoinsData;

  @Input()
  public alerts: Alert[];
}
