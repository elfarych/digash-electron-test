import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepthMapData, DepthMapSettings } from '../../utils/models';
import { DepthMapOrdersBlockComponent } from '../depth-map-orders-block/depth-map-orders-block.component';
import { Exchange } from '../../../../shared/models/Exchange';
import { isMobileDevice } from '../../../../shared/utils/device';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-depth-map-area',
  standalone: true,
  imports: [CommonModule, DepthMapOrdersBlockComponent, TranslateModule],
  templateUrl: './depth-map-area.component.html',
  styleUrls: ['./depth-map-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthMapAreaComponent {
  @Input()
  public depthData: DepthMapData;

  @Input()
  public settings: DepthMapSettings;

  @Output()
  public openChart: EventEmitter<{ exchange: Exchange; symbol: string }> =
    new EventEmitter<{ exchange: Exchange; symbol: string }>();
  protected readonly isMobileDevice = isMobileDevice;
}
