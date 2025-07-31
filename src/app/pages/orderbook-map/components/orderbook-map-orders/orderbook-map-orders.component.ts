import { JsonPipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Alert } from '../../../../shared/models/Alert';
import { ChartSettings } from '../../../../shared/models/ChartSettings';
import { Exchange } from '../../../../shared/models/Exchange';
import { Preferences } from '../../../../shared/models/Preferences';
import {
  OrderbookMapCoinsData,
  OrderbookMapLimitOrderData,
  OrderbookMapSettings,
} from '../../utils/models';
import { OrderbookMapOrderComponent } from './orderbook-map-order/orderbook-map-order.component';

@Component({
  selector: 'app-orderbook-map-orders',
  templateUrl: './orderbook-map-orders.component.html',
  styleUrls: ['./orderbook-map-orders.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrderbookMapOrderComponent, NgForOf, JsonPipe],
})
export class OrderbookMapOrdersComponent {
  @Input()
  public orders: OrderbookMapLimitOrderData[] = [];

  @Input()
  public ordersType: 'ask' | 'bid';

  @Input()
  public size: 1 | 2 = 1;

  @Input()
  public settings: OrderbookMapSettings;

  @Output()
  public openChart: EventEmitter<{ exchange: Exchange; symbol: string }> =
    new EventEmitter<{ exchange: Exchange; symbol: string }>();

  @Input()
  public preferences: Preferences;
  @Input()
  public chartSettings: ChartSettings;
  @Input()
  public coinsData: OrderbookMapCoinsData;

  @Input()
  public alerts: Alert[];

  public orderIdentify(
    index: number,
    value: OrderbookMapLimitOrderData,
  ): string {
    return `${value.symbol}${value.created_time}`;
  }
}
