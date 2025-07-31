import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { getExchangeData } from '../../../models/Exchange';
import { AlertNotification } from '../../../models/Notification';
import { getMinutesDiffFromDate } from '../../../utils/getMinutesDiff';
import { getAlertColor, getAlertTypeText } from '../../../models/Alert';
import { TranslateService } from '@ngx-translate/core';
import { getNotificationContent } from '../../../utils/getNotificationContent';

@Component({
  selector: 'app-notifications-item',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './notifications-item.component.html',
  styleUrls: ['./notifications-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsItemComponent {
  @Input()
  public notification: AlertNotification;

  @Output()
  public select: EventEmitter<AlertNotification> =
    new EventEmitter<AlertNotification>();

  public notificationTitle: string;
  public notificationContent: string;
  public notificationCreated: string;

  constructor(private translateService: TranslateService) {}

  public ngOnInit(): void {
    if (this.notification) {
      this.notificationTitle = this.getTitle();
      this.notificationContent = this.getContent();
      this.notificationCreated = this.getCreated();
    }
  }

  public get exchangeName(): string {
    return getExchangeData(this.notification.exchange)?.name;
  }

  public get exchangeIcon(): string {
    return getExchangeData(this.notification.exchange)?.icon;
  }

  public openNotification(): void {
    this.select.emit(this.notification);
  }

  private getTitle(): string {
    return this.notification.symbol;
  }

  public getAlertTypeText(): string {
    return getAlertTypeText(
      this.notification.alert_type,
      this.translateService,
    );
  }

  public getLocale(): string {
    return this.translateService.currentLang;
  }

  private getContent(): string {
    return getNotificationContent(this.notification, this.translateService);
  }

  private getCreated(): string {
    return `${getMinutesDiffFromDate(this.notification.created_at)} ${this.translateService.instant('alerts.minutesAgo')}`;
  }

  protected readonly getAlertColor = getAlertColor;
  protected readonly getExchangeData = getExchangeData;
}
