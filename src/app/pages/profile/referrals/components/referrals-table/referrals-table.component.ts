import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ProfileReferral } from '../../utils/models/referrals.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-referrals-table',
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
    TranslateModule,
    PanelModule
  ],
  templateUrl: './referrals-table.component.html',
  styleUrls: ['./referrals-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralsTableComponent {
  @Input()
  public referralsData: ProfileReferral[] = [];
}
