import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../store/notifications/notifciations.service';
import { AlertNotification } from '../../models/Notification';
import { NotificationsItemComponent } from './notifications-item/notifications-item.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NotificationsItemComponent, MatIconModule, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  @Input()
  public notifications: AlertNotification[] = [];

  public newNotifications = 0;

  constructor(private notificationsService: NotificationsService) {}

  public ngOnChanges({ notifications }: SimpleChanges): void {
    if (notifications) {
      this.newNotifications = this.notifications.reduce(
        (acc, notification) => acc + (notification.watched ? 0 : 1),
        0,
      );
    }
  }

  public viewAll(): void {
    this.notificationsService.viewAll();
  }

  public clickNotification(notification: AlertNotification): void {
    this.notificationsService.view(notification.notification_id);
    // this.router.navigate(['app', 'coin-order-book', notification.exchange, notification.symbol]);
  }
}
