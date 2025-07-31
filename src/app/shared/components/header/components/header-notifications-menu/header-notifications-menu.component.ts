import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertNotification } from '../../../../models/Notification';
import { MenuComponent } from '../../../menu/menu.component';
import { MenuTriggerDirective } from '../../../menu/menu-trigger.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../../store/notifications/notifciations.service';
import { MatIconModule } from '@angular/material/icon';
import { NotificationsItemComponent } from '../../../notifications/notifications-item/notifications-item.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header-notifications-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    MenuTriggerDirective,
    AngularSvgIconModule,
    NotificationsItemComponent,
    MatIconModule,
    MatBadgeModule,
    MatRippleModule,
    TranslateModule,
  ],
  templateUrl: './header-notifications-menu.component.html',
  styleUrls: ['./header-notifications-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNotificationsMenuComponent implements OnChanges {
  @ViewChild(MenuComponent)
  public menuComponent: MenuComponent;

  @Input()
  public notifications: AlertNotification[];

  @Input()
  public allNotificationsMode = true;

  @Input()
  private alertId: number;

  @Output()
  public closeMenu: EventEmitter<void> = new EventEmitter<void>();

  public newNotifications = 0;

  public constructor(
    private notificationsService: NotificationsService,
    private router: Router,
  ) {}

  public ngOnChanges({ notifications }: SimpleChanges): void {
    if (notifications) {
      this.newNotifications = this.notifications?.reduce(
        (acc, notification) => acc + (notification.watched ? 0 : 1),
        0,
      );
    }
  }

  public viewAll(): void {
    this.notificationsService.viewAll();
    this.closeMenu.emit();
  }

  public deleteAll(): void {
    if (this.alertId) {
      this.notificationsService.removeAll(this.alertId);
    }
  }

  public clickNotification(notification: AlertNotification): void {
    this.notificationsService.view(notification.notification_id);
    this.router.navigate([
      'app',
      'coins-view',
      notification.exchange,
      notification.symbol,
    ]);
  }
}
