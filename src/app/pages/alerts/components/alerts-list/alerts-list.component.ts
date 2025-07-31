import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Alert } from '../../../../shared/models/Alert';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { AlertsItemComponent } from './alerts-item/alerts-item.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [
    PanelModule,
    CardModule,
    DatePipe,
    ButtonModule,
    NgIf,
    ChipModule,
    AlertsItemComponent,
    NgForOf,
    PaginatorModule,
    TranslateModule
  ],
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsListComponent {
  @Input()
  public alerts: Alert[] = [];

  @Output()
  public sectionTitle: string;

  @Output()
  public removeAlert: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public stopAlert: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public activateAlert: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public editAlert: EventEmitter<Alert> = new EventEmitter<Alert>();

  @Output()
  public openNotifications: EventEmitter<Alert> = new EventEmitter<Alert>();

  public readonly paginatorPerPageItemsCount: number = 18;

  public paginatorSlice: number[] = [0, this.paginatorPerPageItemsCount];

  public onPageChange(state: PaginatorState) {
    this.paginatorSlice = [
      state.page * state.rows,
      (state.page + 1) * state.rows,
    ];
  }
}
