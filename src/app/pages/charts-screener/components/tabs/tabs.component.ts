import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { Workspace } from '../../../../shared/models/Workspace';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuComponent } from '../../../../shared/components/menu/menu.component';
import { NotificationsComponent } from '../../../../shared/components/notifications/notifications.component';
import { MenuTriggerDirective } from '../../../../shared/components/menu/menu-trigger.directive';
import { MatBadgeModule } from '@angular/material/badge';
import { AlertNotification } from '../../../../shared/models/Notification';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    MatRippleModule,
    MatIconModule,
    MenuComponent,
    NotificationsComponent,
    MenuTriggerDirective,
    MatBadgeModule,
    MatTooltipModule,
    TabViewModule,
    TranslateModule
  ],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements OnChanges {
  @Input()
  public workspaces: Workspace[] = [];

  @Input()
  public selectedWorkspace!: Workspace;

  @Input()
  public notifications: AlertNotification[];

  @Output()
  public selectTab: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public createTab: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public remove: EventEmitter<Workspace> = new EventEmitter<Workspace>();

  @Output()
  public editWorkspace: EventEmitter<Workspace> = new EventEmitter<Workspace>();

  @Output()
  public updateSorting: EventEmitter<number> = new EventEmitter<number>();

  public newNotifications = 0;

  public ngOnChanges({ notifications }: SimpleChanges): void {
    if (notifications) {
      this.newNotifications = this.notifications.reduce(
        (acc, notification) => acc + (notification.watched ? 0 : 1),
        0,
      );
    }
  }

  public handleOpenSettings(event: MouseEvent, data: Workspace): void {
    event.preventDefault();
    event.stopPropagation();
    this.editWorkspace.emit(data);
  }

  public handleRemove(event: MouseEvent, data: Workspace): void {
    event.preventDefault();
    event.stopPropagation();
    this.remove.emit(data);
  }
}
