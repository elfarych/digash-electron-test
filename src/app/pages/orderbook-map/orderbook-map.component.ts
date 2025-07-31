import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, Observable, Subscription } from 'rxjs';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { Alert } from '../../shared/models/Alert';
import { ChartSettings } from '../../shared/models/ChartSettings';
import { Preferences } from '../../shared/models/Preferences';
import { OrderbookMapAreaComponent } from './components/orderbook-map-area/orderbook-map-area.component';
import { OrderbookMapLoaderComponent } from './components/orderbook-map-loader/orderbook-map-loader.component';
import { OrderbookMapSettingsComponent } from './components/orderbook-map-settings/orderbook-map-settings.component';
import { OrderbookMapService } from './orderbook-map.service';
import {
  OrderbookMapCoinsData,
  OrderbookMapData,
  OrderbookMapSettings,
} from './utils/models';
import { TranslateModule } from '@ngx-translate/core';
import { PremiumMessageBannerComponent } from '../../shared/components/premium-message-banner/premium-message-banner.component';
import { BlockUIModule } from 'primeng/blockui';

@Component({
  selector: 'app-orderbook-map',
  standalone: true,
  imports: [
    CommonModule,
    OrderbookMapAreaComponent,
    OrderbookMapLoaderComponent,
    OrderbookMapSettingsComponent,
    ProgressSpinnerComponent,
    TranslateModule,
    PremiumMessageBannerComponent,
    BlockUIModule,
  ],
  templateUrl: './orderbook-map.component.html',
  styleUrls: ['./orderbook-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderbookMapComponent implements OnInit, OnDestroy {
  public premiumIsActive$: Observable<boolean> =
    this.service.getPremiumIsActive();
  public settings$: Observable<OrderbookMapSettings> =
    this.service.getSettings();
  public orderbookMapData$: Observable<OrderbookMapData> =
    this.service.getOrderbookMapData();
  public loading$: Observable<boolean> = this.service.getLoading();
  public pageLoading$: Observable<boolean> = this.service.getPageLoading();
  public coins$: Observable<{ symbol: string }[]> =
    this.service.getOrderbookCoins();

  public chartSettings$: Observable<ChartSettings> =
    this.service.getChartSettings();
  public preferences$: Observable<Preferences> = this.service.getPreferences();
  public orderBookCoinsData$: Observable<OrderbookMapCoinsData> =
    this.service.getOrderbookMapCoinsData();
  public alerts$: Observable<Alert[]> = this.service.getAlerts();
  public size: 1 | 2 = 1;

  private subscriptions: Subscription = new Subscription();

  constructor(private service: OrderbookMapService) {}

  public ngOnInit() {
    this.subscriptions.add(
      this.premiumIsActive$.pipe(filter(Boolean)).subscribe(() => {
        this.service.loadSettings();
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public changeSettings(settings: OrderbookMapSettings): void {
    this.service.updateSettings(settings);
  }

  public reloadData(): void {
    this.service.loadOrderbookData();
  }

  public openChart({ exchange, symbol }): void {
    this.service.openChart(exchange, symbol);
  }

  // @HostListener('mousewheel', ['$event'])
  // public onMousewheel(event) {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   if (event.wheelDelta > 0) {
  //     this.size = 2;
  //   } else {
  //     this.size = 1;
  //   }
  // }

  public resize(): void {
    this.size = this.size === 1 ? 2 : 1;
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.code.toLowerCase() === 'keyr') {
      this.reloadData();
    }
    if (event.key === '=' || (event.shiftKey && event.key === '+')) {
      this.resize();
    }
  }
}
