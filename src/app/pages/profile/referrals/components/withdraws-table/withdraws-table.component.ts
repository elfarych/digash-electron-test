import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { Withdraw } from '../../utils/models/referrals.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-withdraws-table',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DatePipe,
    DropdownModule,
    FormsModule,
    PanelModule,
    NgIf,
    AsyncPipe,
    NgClass,
    TranslateModule
  ],
  templateUrl: './withdraws-table.component.html',
  styleUrls: ['./withdraws-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawsTableComponent {
  @Input()
  public withdraws: Withdraw[] = [];

  public getWithdrawStatusText(withdraw: Withdraw): string {
    if (withdraw.completed) return 'Выплачено';
    if (withdraw.canceled) return 'Отменено';
    return 'В ожидании';
  }
}
