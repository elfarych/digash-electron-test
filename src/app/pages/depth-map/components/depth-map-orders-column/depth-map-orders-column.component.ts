import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepthMapSettings, LimitOrderDepthMapData } from '../../utils/models';
import { DepthMapOrderComponent } from '../depth-map-order/depth-map-order.component';
import { Exchange } from '../../../../shared/models/Exchange';

@Component({
  selector: 'app-depth-map-orders-column',
  standalone: true,
  imports: [CommonModule, DepthMapOrderComponent],
  templateUrl: './depth-map-orders-column.component.html',
  styleUrls: ['./depth-map-orders-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthMapOrdersColumnComponent {
  @Input()
  public orders: LimitOrderDepthMapData[] = [];

  @Input()
  public ordersType: 'ask' | 'bid';

  @Input()
  public columnTitle: string;

  @Input()
  public showColsTitle: boolean = true;

  @Input()
  public settings: DepthMapSettings;

  @Input()
  public blockType: 'distant' | 'near';

  @Input()
  public titlePosition: 'top' | 'bottom' = 'bottom';

  @Output()
  public openChart: EventEmitter<{ exchange: Exchange; symbol: string }> =
    new EventEmitter<{ exchange: Exchange; symbol: string }>();

  public get columnTitleStyle(): Record<string, string | number> {
    return {
      [this.titlePosition]: 0,
    };
  }

  public orderIdentify(index: number, value: LimitOrderDepthMapData): string {
    return `${value.symbol}${value.created_time}`;
  }
}
