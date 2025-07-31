import { Injectable } from '@angular/core';
import { AlertsService } from '../../store/alerts/alerts.service';
import { filter, firstValueFrom, map, Observable } from 'rxjs';
import { AlertSettings } from '../../models/AlertSettings';
import { selectErrorMessage } from '../../store/alerts/alerts.selectors';

@Injectable({
  providedIn: 'root',
})
export class TelegramSetupService {
  public telegramChatId$: Observable<string> = this.alertService
    .getAlertSettings()
    .pipe(
      filter(Boolean),
      map((settings: AlertSettings) => settings?.telegram_user_id),
    );

  public readonly errorMessage$: Observable<string> =
    this.alertService.getErrorMessage();

  constructor(private alertService: AlertsService) {}

  public async updateTelegramChatId(chatId: string): Promise<void> {
    const alertSettings = await firstValueFrom(
      this.alertService.getAlertSettings(),
    );
    this.alertService.updateAlertSettings({
      ...alertSettings,
      telegram_user_id: chatId,
    });
  }
}
