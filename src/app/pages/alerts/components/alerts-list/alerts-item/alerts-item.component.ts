import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import {
  Alert,
  getAlertColor,
  getAlertTypeText,
} from '../../../../../shared/models/Alert';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import {
  AsyncPipe,
  DatePipe,
  formatDate,
  JsonPipe,
  NgClass,
  NgIf,
  NgStyle,
} from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { HeaderNotificationsMenuComponent } from '../../../../../shared/components/header/components/header-notifications-menu/header-notifications-menu.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { getExchangeData } from '../../../../../shared/models/Exchange';
import { getReadableExchangeName } from '../../../../../shared/utils/getReadableExchangeName';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alerts-item',
  standalone: true,
  imports: [
    PanelModule,
    CardModule,
    DatePipe,
    ButtonModule,
    NgIf,
    ChipModule,
    BadgeModule,
    AsyncPipe,
    HeaderNotificationsMenuComponent,
    OverlayPanelModule,
    NgStyle,
    TranslateModule,
    NgClass,
    SvgIconComponent,
    JsonPipe,
  ],
  templateUrl: './alerts-item.component.html',
  styleUrls: ['./alerts-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsItemComponent {
  @Input()
  public alert: Alert;

  @Output()
  private removeAlert: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  private stopAlert: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  private activateAlert: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  private editAlert: EventEmitter<Alert> = new EventEmitter<Alert>();

  protected readonly formatDate = formatDate;

  constructor(private translateService: TranslateService) {}

  public getAlertTypeText(): string {
    return getAlertTypeText(this.alert.type, this.translateService);
  }

  public readableExchangeName(): string {
    return getReadableExchangeName(this.alert.market, this.translateService);
  }

  public getExchangeIcon(): string {
    return getExchangeData(this.alert.market)?.icon ?? '';
  }

  public remove(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.removeAlert.emit(this.alert.id);
  }

  public stop(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.stopAlert.emit(this.alert.id);
  }

  public activate(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.activateAlert.emit(this.alert.id);
  }

  public edit(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.editAlert.emit(this.alert);
  }

  public playSound() {
    document.querySelectorAll('audio').forEach((el) => el.pause());
    const audio = new Audio();
    audio.src = `../../../assets/sounds/${this.alert.alert_sound_name}.mp3`;
    audio.load();
    audio.play();
  }

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly getAlertColor = getAlertColor;
}
