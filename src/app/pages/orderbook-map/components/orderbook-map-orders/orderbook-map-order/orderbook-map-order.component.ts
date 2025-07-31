import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Observable } from 'rxjs';
import { MiniChartComponent } from '../../../../../shared/components/mini-chart/mini-chart.component';
import { Alert } from '../../../../../shared/models/Alert';
import { ChartSettings } from '../../../../../shared/models/ChartSettings';
import { CoinData } from '../../../../../shared/models/CoinData';
import {
  Exchange,
  ExchangeData,
  getExchangeData,
} from '../../../../../shared/models/Exchange';
import { Preferences } from '../../../../../shared/models/Preferences';
import { WatchlistCoin } from '../../../../../shared/models/Watchlist';
import { ConvertBigNumberPipe } from '../../../../../shared/pipes/convert-big-number.pipe';
import { normalizeCoinQuoteSymbol } from '../../../../../shared/utils/normalizeCoinQuoteSymbol';
import {
  OrderbookMapLimitOrderData,
  OrderbookMapSettings,
} from '../../../utils/models';
import { OrderbookMapService } from '../../../orderbook-map.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-orderbook-map-order',
  standalone: true,
  imports: [
    CommonModule,
    ConvertBigNumberPipe,
    OverlayPanelModule,
    MiniChartComponent,
    TranslateModule,
    MatTooltipModule,
  ],
  templateUrl: './orderbook-map-order.component.html',
  styleUrls: ['./orderbook-map-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderbookMapOrderComponent implements OnChanges, OnInit {
  @Input()
  public order: OrderbookMapLimitOrderData;

  @Input()
  public orderType: 'ask' | 'bid';

  @Input()
  public orderIndex: number;

  @Input()
  public ordersCount: number = 0;

  @Input()
  public size: 1 | 2 = 1;

  @Input()
  public settings: OrderbookMapSettings;

  public orderStyle: Record<string, string | number> = {};
  public overlayIsActive: boolean = false;
  public mouseOnOrder: boolean = false;
  public showChart: boolean = false;
  public miniChartId: string = '';

  @Input()
  public preferences: Preferences;
  @Input()
  public chartSettings: ChartSettings;
  @Input()
  public coinData: CoinData;

  @Input()
  public alerts: Alert[];

  @Output()
  public openChart: EventEmitter<{ exchange: Exchange; symbol: string }> =
    new EventEmitter<{ exchange: Exchange; symbol: string }>();

  public mergedChartSettings: ChartSettings;

  constructor(
    private service: OrderbookMapService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.miniChartId = this.order.symbol + this.order.exchange + this.order;
  }

  public ngOnChanges({ order, size, settings, chartSettings }: SimpleChanges) {
    if (order) {
      if (
        JSON.stringify(order.previousValue) !==
        JSON.stringify(order.currentValue)
      ) {
        this.setOrderStyle();
      }
    }

    if (size) {
      setTimeout(() => this.setOrderStyle(), 250);
    }

    if (settings || chartSettings) {
      this.mergeSettings();
    }
  }

  public openOrderChart(miniChart: OverlayPanel): void {
    miniChart.hide();
    this.openChart.emit({
      exchange: this.order.exchange,
      symbol: this.order.symbol,
    });
  }

  public setOrderStyle(): void {
    const orderScale =
      this.order.sizeInPercent / 100 > 0.7
        ? this.order.sizeInPercent / 100
        : 0.7;

    const dotSize = 75 * orderScale;
    const halfSize = dotSize / 2;

    let { x, y } = this.getPositionOnCircle();

    x = Math.min(Math.max(x, halfSize), window.innerWidth - halfSize);
    y = Math.min(Math.max(y, halfSize), window.innerHeight - halfSize);

    if (window.innerWidth < 992) {
      x = x - 10;
      if (this.size === 2 && this.order.distance > 1) {
        this.orderStyle['display'] = 'none';
      } else {
        this.orderStyle['display'] = 'block';
      }
    }

    this.orderStyle['left'] = `${x - halfSize}px`;
    this.orderStyle['top'] = `${y - halfSize}px`;
    this.orderStyle['transform'] = `scale(${orderScale})`;

    this.cdr.detectChanges();
  }

  public async onOrderMouseEnter(
    chart: OverlayPanel,
    event: Event,
  ): Promise<void> {
    if (window.innerWidth < 992) {
      return void 0;
    }

    if (!this.settings.openChartOnHover) {
      return void 0;
    }

    this.mouseOnOrder = true;
    chart.show(event);
    // setTimeout(async () => {
    //   if (this.mouseOnOrder) {
    //     this.cdr.detectChanges();
    //     chart.show(event);
    //   }
    // }, 1000);
  }

  public onOrderMouseLeave(chart: OverlayPanel): void {
    if (!this.settings.openChartOnHover) {
      return void 0;
    }

    this.mouseOnOrder = false;
    // chart.hide();
    setTimeout(() => {
      if (!this.overlayIsActive) {
        chart.hide();
      }
    }, 250);
  }

  public onChartMouseEnter(): void {
    this.overlayIsActive = true;
  }

  public onChartMouseLeave(chart: OverlayPanel): void {
    this.overlayIsActive = false;
    // chart.hide();
    // setTimeout(() => {
    //   if (!this.overlayIsActive) {
    //     chart.hide();
    //   }
    // }, 1500);
  }

  public onOverlayPanelShow(): void {
    this.mergeSettings();

    this.showChart = true;
  }

  public onOverlayPanelHide(): void {
    this.showChart = false;
  }

  public get exchangeData(): ExchangeData {
    return getExchangeData(this.order.exchange);
  }

  public getWatchlistCoins(exchange: Exchange): Observable<WatchlistCoin[]> {
    return this.service.getWatchlistCoins(exchange);
  }

  private getPositionOnCircle(): { x: number; y: number } {
    const innerCircle = document.querySelector('.round-2');
    const outerCircle = document.querySelector('.round-1');

    if (!innerCircle) {
      return { x: 0, y: 0 };
    }

    const smallCircleDistance = this.settings.smallCircleDistance ?? 1;
    const largeCircleDistance = this.settings.largeCircleDistance ?? 3;

    const innerCircleRect = innerCircle?.getBoundingClientRect() ?? {
      width: 400,
      left: document.defaultView.innerWidth / 2,
      height: 400,
      top: document.defaultView.innerHeight / 2,
    };
    const outerCircleRect = outerCircle?.getBoundingClientRect() ?? {
      width: 800,
      left: document.defaultView.innerWidth / 2,
      height: 400,
      top: document.defaultView.innerHeight / 2,
    };

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const angle = this.calculateAngle(this.orderIndex, this.ordersCount);

    let radius = 0;
    if (this.order.distance <= smallCircleDistance) {
      radius =
        this.order.distance *
        (innerCircleRect.width / (smallCircleDistance * 2));
    } else {
      const minOuterRadius = innerCircleRect.width / 2;
      const maxOuterRadius = outerCircleRect.width / 2;
      radius =
        minOuterRadius +
        ((this.order.distance - smallCircleDistance) /
          (largeCircleDistance - smallCircleDistance)) *
          (maxOuterRadius - minOuterRadius);
    }

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return { x, y };
  }

  private calculateAngle(index: number, total: number): number {
    if (total <= 0) {
      return 0;
    }
    const angleStep = (2 * Math.PI) / total;
    return index * angleStep;
  }

  private mergeSettings(): void {
    this.mergedChartSettings = this.service.mergeChartSettings(
      this.chartSettings,
      this.settings,
      this.exchangeData,
    );
  }

  protected readonly normalizeCoinQuoteSymbol = normalizeCoinQuoteSymbol;
}
