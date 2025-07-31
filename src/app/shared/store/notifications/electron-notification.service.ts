import { Injectable } from '@angular/core';
import { AlertNotification } from '../../models/Notification';
import { getNotificationContent } from '../../utils/getNotificationContent';
import { TranslateService } from '@ngx-translate/core';

declare global {
  interface Window {
    electron: any;
    electronAPI: any;
  }
}

@Injectable({ providedIn: 'root' })
export class ElectronNotificationService {
  constructor(private readonly translateService: TranslateService) {}

  public sendNotifications(
    notifications: AlertNotification[],
    soundAlertsEnabled = true,
  ): void {
    for (const notification of notifications) {
      if (!notification.sound_alert && !soundAlertsEnabled) {
        continue;
      }
      const title = notification.symbol;
      const content = getNotificationContent(
        notification,
        this.translateService,
      );

      const deeplink = `/app/coins-view/${notification.exchange}/${notification.symbol}`;

      this.sendNotification(title, content, deeplink);
    }
  }

  public onNotificationClick(callback: (deepLink: string) => void): void {
    (window as any).electronAPI?.onNotificationClick(callback);
  }

  private sendNotification(
    title: string,
    body: string,
    deeplink: string,
  ): void {
    const plainBody = body.replace(/<br\s*\/?>/gi, '\n');
    (window as any).electronAPI?.sendNotification(title, plainBody, deeplink);
  }
}
