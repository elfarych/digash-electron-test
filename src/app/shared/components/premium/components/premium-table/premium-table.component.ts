import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ComparisonTableData } from '../../comparisonTable1';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-premium-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TranslateModule],
  templateUrl: './premium-table.component.html',
  styleUrls: ['./premium-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumTableComponent {
  @Input()
  public comparisonTableData: ComparisonTableData[] = [];

  @Input()
  public title: string;
}
