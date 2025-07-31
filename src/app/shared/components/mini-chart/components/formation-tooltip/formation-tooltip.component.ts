import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CoinData,
  CoinDataHorizontalLevelData,
} from '../../../../models/CoinData';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { UnauthorizedDirective } from '../../../../directives/unauthorized.directive';
import { HeaderNotificationsMenuComponent } from '../../../header/components/header-notifications-menu/header-notifications-menu.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChartSettings } from '../../../../models/ChartSettings';
import { LimitOrderData } from '../../../../models/LimitOrderData';
import { Exchange } from '../../../../models/Exchange';
import { calculateDistance } from '../../../../utils/calculateDistance';

import {
  getFormationThreshold,
  getLimitOrderSize,
  LimitOrderSize,
} from '../../../night-vision-chart/util/getLimitOrderTooltipData';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-formation-tooltip',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    UnauthorizedDirective,
    HeaderNotificationsMenuComponent,
    OverlayPanelModule,
  ],
  templateUrl: './formation-tooltip.component.html',
  styleUrls: ['./formation-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFormationTooltipComponent implements OnChanges, OnInit {
  @Input()
  private coinData: CoinData;

  @Input()
  private chartSettings: ChartSettings;

  @Input()
  private exchange: Exchange;

  public tooltip: string;

  constructor(private translateService: TranslateService) {}

  public ngOnInit() {
    this.tooltip = this.constructTooltip();
  }

  public ngOnChanges({ coinData, chartSettings }: SimpleChanges): void {
    if (coinData || chartSettings) {
      this.tooltip = this.constructTooltip();
    }
  }

  private getChartLevels(): CoinDataHorizontalLevelData[] {
    const levels = this.coinData.horizontal_levels;
    if (levels) {
      return [
        ...levels['5m'],
        ...levels['15m'],
        ...levels['1h'],
        ...levels['4h'],
        ...levels['24h'],
      ];
    }
    return [];
  }

  private getSortedLimitOrders(orders: LimitOrderData[]): LimitOrderData[] {
    return orders
      .filter(
        (o) => Math.abs(o.distance) <= this.chartSettings.limitOrderDistance,
      )
      .sort((a, b) => b.corrosion_time - a.corrosion_time);
  }

  private checkLimitOrderLevel(
    order: LimitOrderData,
    levels: CoinDataHorizontalLevelData[],
    threshold: number,
  ): boolean {
    return levels.some(
      (l) => calculateDistance(l[1], order.price) <= threshold,
    );
  }

  private getLimitOrderOnLevelBySize(
    orders: LimitOrderData[],
    orderSize: LimitOrderSize,
  ): LimitOrderData | undefined {
    const threshold = getFormationThreshold(this.coinData);
    const levels = this.getChartLevels();
    return orders.find((o) => {
      return (
        this.checkLimitOrderLevel(o, levels, threshold) &&
        orderSize === getLimitOrderSize(o, this.coinData, this.exchange)
      );
    });
  }

  private constructTooltip(): string {
    if (!this.coinData) return '';

    const sortedOrders = this.getSortedLimitOrders([
      ...this.coinData.a,
      ...this.coinData.b,
    ]);

    const hasImpulseActivity =
      this.coinData?.formations?.impulse_formations
        ?.impulse_count_gt_5_percent_gt_3_period_24h ||
      this.coinData?.formations?.impulse_formations
        ?.impulse_count_gt_5_percent_gt_1_period_10h;

    const bigOrder = this.getLimitOrderOnLevelBySize(sortedOrders, 'big');
    if (bigOrder) {
      return `<i>${this.translateService.instant('tooltip.activeCoin')}, <br>
              ${this.translateService.instant('tooltip.bigDensity')}, <br>
              ${this.translateService.instant('tooltip.considerBreak')}${hasImpulseActivity ? ' <b>' + this.translateService.instant('tooltip.takeImpulse') + '</b>' : ''}:</i><br>
              ${this.translateService.instant('tooltip.entryPoint')}`;
    }

    const mediumOrder = this.getLimitOrderOnLevelBySize(sortedOrders, 'medium');

    if (mediumOrder) {
      return `<i>${this.translateService.instant('tooltip.activeCoin')}, <br>
              ${this.translateService.instant('tooltip.mediumDensity')}, <br>
              ${this.translateService.instant('tooltip.considerBreak')}${hasImpulseActivity ? ' <b>' + this.translateService.instant('tooltip.takeImpulse') + '</b>' : ''}:</i><br>
              ${this.translateService.instant('tooltip.entryPointMedium')}`;
    }

    if (hasImpulseActivity || this.coinData.is_active) {
      return `<i>${this.translateService.instant('tooltip.activeCoin')}, <br>
              ${this.translateService.instant('tooltip.considerBreak')}, <b>${this.translateService.instant('tooltip.takeImpulse')}</b>:</i><br>
              ${this.translateService.instant('tooltip.entryPointActivity')}`;
    }

    // return `<i>${this.translateService.instant('tooltip.activeCoin')}, ${this.translateService.instant('tooltip.considerBreak')}:</i><br>
    //         ${this.translateService.instant('tooltip.entryPointGeneral')}`;

    return '';
  }
}
