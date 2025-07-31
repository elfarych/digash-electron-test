import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepthMapOrderGroup, DepthMapSettings } from '../../utils/models';
import { DepthMapOrdersColumnComponent } from '../depth-map-orders-column/depth-map-orders-column.component';
import { Exchange } from '../../../../shared/models/Exchange';

@Component({
  selector: 'app-depth-map-orders-block',
  standalone: true,
  imports: [CommonModule, DepthMapOrdersColumnComponent],
  templateUrl: './depth-map-orders-block.component.html',
  styleUrls: ['./depth-map-orders-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthMapOrdersBlockComponent {
  @Input()
  public ordersType: 'ask' | 'bid';

  @Input()
  public styles: Record<string, number | string> = {};

  @Input()
  public depthDataOrdersGroup: DepthMapOrderGroup;

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
}
