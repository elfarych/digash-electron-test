import { Injectable } from '@angular/core';
import { filter, retry } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { WebSocketSubject } from 'rxjs/webSocket';
import { KlineStreamService } from '../../api/kline-stream.service';
import { Alert, PriceAlert } from '../../models/Alert';
import { CandlestickVisualization } from '../../models/Candlestick';
import { Exchange } from '../../models/Exchange';
import { NotificationsService } from '../notifications/notifciations.service';
import { AlertsService } from './alerts.service';

@Injectable({ providedIn: 'root' })
export class AlertsProcessing {
  private alerts: { [id: string]: PriceAlert } = {};
  private priceStreams: {
    [id: string]: WebSocketSubject<CandlestickVisualization>;
  } = {};
  private prevPrices: { [coin: string]: number } = {};
  private candleStickStreamUpdates: Map<
    string,
    Subject<CandlestickVisualization>
  > = new Map();
  private alertLoaded: boolean = false;

  constructor(
    private readonly klineStreamService: KlineStreamService,
    private readonly notificationsService: NotificationsService,
    private readonly alertsService: AlertsService,
  ) {}

  public setAlerts(alerts: PriceAlert[]): void {
    if (this.alertLoaded) {
      return void 0;
    }
    alerts = alerts.filter((a) => this.checkAlert(a));
    alerts.forEach((a) => {
      this.alerts[String(a.id)] = a;
    });
    this.alertLoaded = true;
    this.setupAlertsStream(alerts);
  }

  public addAlert(alert: PriceAlert): void {
    if (!this.checkAlert(alert)) {
      return void 0;
    }

    this.alerts[String(alert.id)] = alert;
    const streamKey = this.getAlertStreamKey(alert);
    if (!this.priceStreams[streamKey]) {
      this.setupAlertWebsocket(alert);
    }
  }

  public updateAlert(alert: PriceAlert): void {
    if (alert.active && alert.sound_alert) {
      this.alerts[String(alert.id)] = alert;
    } else {
      this.deleteAlert(alert.id);
    }
  }

  public deleteAlert(id: number): void {
    const alert = this.alerts[String(id)];
    if (!alert) {
      return void 0;
    }

    const coinAlerts = Object.values(this.alerts).filter(
      (a) => a.symbol === alert.symbol && a.market === alert.market,
    );
    if (coinAlerts.length - 1 <= 0) {
      const streamKey = this.getAlertStreamKey(alert);
      this.priceStreams[streamKey]?.unsubscribe();
      delete this.priceStreams[streamKey];
    }

    delete this.alerts[String(id)];
  }

  private clear(): void {
    this.alerts = {};
    this.prevPrices = {};
    for (const key in this.priceStreams) {
      const stream = this.priceStreams[key];
      stream.unsubscribe();
      delete this.priceStreams[key];
    }
  }

  private setupAlertsStream(alerts: PriceAlert[]): void {
    alerts.forEach((a) => {
      const streamKey = this.getAlertStreamKey(a);
      if (!this.priceStreams[streamKey]) {
        this.setupAlertWebsocket(a);
      }
    });
  }

  private priceStreamDataHandler(
    symbol: string,
    exchange: Exchange,
    price: number,
  ): void {
    const priceKey = `${symbol}${exchange}`;
    if (!this.prevPrices[priceKey]) {
      this.prevPrices[priceKey] = price;
      return void 0;
    }

    const prevPrice = this.prevPrices[priceKey];

    const alerts = Object.values(this.alerts).filter(
      (a) => a.symbol === symbol && a.market === exchange,
    );

    alerts.forEach((a) => {
      if (this.checkNotificationCondition(a, prevPrice, price)) {
        this.deleteAlert(a.id);
        this.createNotification(a);
      }
    });

    this.prevPrices[priceKey] = price;
  }

  private checkNotificationCondition(
    alert: PriceAlert,
    price: number,
    prevPrice: number,
  ): boolean {
    if (prevPrice < alert.price_crossing && price >= alert.price_crossing) {
      return true;
    }
    return prevPrice > alert.price_crossing && price <= alert.price_crossing;
  }

  private createNotification(alert: PriceAlert): void {
    const notification = {
      data: {
        price_crossing: alert.price_crossing,
        init_price: alert.init_price,
        timestamp: Date.now(),
      },
      alert_type: alert.type,
      watched: false,
      created_at: new Date(Date.now()).toString(),
      symbol: alert.symbol,
      notification_id: Date.now(),
      exchange: alert.market,
      sound_alert: true,
      show_chart: false,
      alert_sound_name: alert.alert_sound_name,
    };

    this.notificationsService.updateNotifications([notification]);
    this.notificationsService.triggerAlertNotification(alert.id);
    this.alertsService.triggerPriceAlert(alert);
  }

  private getAlertStreamKey(alert: PriceAlert): string {
    return `${alert.symbol}${alert.market}`;
  }

  private setupAlertWebsocket(alert: PriceAlert): void {
    const streamKey = this.getAlertStreamKey(alert);

    if (this.priceStreams[streamKey]) {
      return void 0;
    }

    const websocketCandlestick = this.klineStreamService.getWebsocketStream(
      alert.market,
      alert.symbol,
      '1m',
    );

    websocketCandlestick
      .pipe(filter(Boolean), retry({ delay: 5000, count: 5 }))
      .subscribe((data: CandlestickVisualization) =>
        this.priceStreamDataHandler(alert.symbol, alert.market, data.close),
      );

    this.priceStreams[streamKey] = websocketCandlestick;
  }

  private checkAlert(alert: Alert): boolean {
    return alert.active && alert.sound_alert && alert.type === 'price';
  }
}
