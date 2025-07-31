import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepthMapSettings, LimitOrderDepthMapData } from '../../utils/models';
import {
  DEPTH_MAP_DISTANT_BLOCK_MAX_DISTANCE,
  DEPTH_MAP_NEAR_BLOCK_MAX_DISTANCE,
} from '../../utils/constants';
import { Exchange, getExchangeData } from '../../../../shared/models/Exchange';
import { convertPrice } from '../../../../shared/utils/convertPrice';

@Component({
  selector: 'app-depth-map-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './depth-map-order.component.html',
  styleUrls: ['./depth-map-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthMapOrderComponent {
  @Input()
  public order: LimitOrderDepthMapData;

  @Input()
  public settings: DepthMapSettings;

  @Input()
  public orderType: 'ask' | 'bid';

  @Input()
  public blockType: 'distant' | 'near';

  @Output()
  public openChart: EventEmitter<{ exchange: Exchange; symbol: string }> =
    new EventEmitter<{ exchange: Exchange; symbol: string }>();

  private hovered: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  public get orderStyle(): Record<string, string | number> {
    const background: string =
      this.orderType === 'ask'
        ? this.settings.askOrdersColor
        : this.settings.bidOrdersColor;

    const styles: Record<string, string | number> = {
      background,
      zIndex: this.hovered
        ? 10
        : this.order.corrosion_time < 8
          ? Math.round(this.order.corrosion_time)
          : 8,
      boxShadow: this.hovered
        ? '1px 1px 15px 0 rgba(0,0,0,.6)'
        : '1px 1px 5px 0 rgba(0,0,0,.6)',
      transform: this.hovered ? 'scale(1.03)' : 'scale(1)',
    };

    if (this.orderType === 'bid') {
      styles['top'] =
        this.getDistancePercentage(this.order.distance).toFixed(3) + '%';
    } else {
      styles['bottom'] =
        this.getDistancePercentage(this.order.distance).toFixed(3) + '%';
    }

    return styles;
  }

  public get orderExchange(): string {
    const exchangeData = getExchangeData(this.order.exchange);

    return `${exchangeData.exchangeName}-${exchangeData.market}`;
  }

  public onOrderClick(): void {
    this.openChart.emit({
      exchange: this.order.exchange,
      symbol: this.order.symbol,
    });
  }

  public onMouseEnter(): void {
    this.hovered = true;
  }

  public onMouseLeave(): void {
    this.hovered = false;
  }

  private getDistancePercentage(distance: number): number {
    const maxDistance =
      this.blockType === 'near'
        ? DEPTH_MAP_NEAR_BLOCK_MAX_DISTANCE
        : DEPTH_MAP_DISTANT_BLOCK_MAX_DISTANCE -
          DEPTH_MAP_NEAR_BLOCK_MAX_DISTANCE;

    if (this.blockType === 'distant') {
      distance = distance - DEPTH_MAP_NEAR_BLOCK_MAX_DISTANCE;
    }

    const clampedDistance = Math.max(0, Math.min(distance, maxDistance));

    return (clampedDistance / maxDistance) * 100;
  }

  protected readonly convertPrice = convertPrice;
}
