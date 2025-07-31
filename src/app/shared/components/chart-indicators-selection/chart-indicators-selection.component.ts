import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  chartBasicTechnicalIndicatorsList,
  ChartTechnicalIndicators,
} from '../../models/chart-indicators/ChartIndicators';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-indicators-selection',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TreeModule,
    CardModule,
    FieldsetModule,
    TranslateModule
  ],
  templateUrl: './chart-indicators-selection.component.html',
  styleUrls: ['./chart-indicators-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartIndicatorsSelectionComponent {
  @Input()
  public selectedChartIndicators: ChartTechnicalIndicators[] = [];

  @Output()
  public selectTechnicalIndicator: EventEmitter<ChartTechnicalIndicators[]> =
    new EventEmitter<ChartTechnicalIndicators[]>();

  public dialogVisible: boolean = false;
  public chartIndicatorsOptions: ChartTechnicalIndicators[] = chartBasicTechnicalIndicatorsList(this.translateService);

  constructor(private translateService: TranslateService) {}

  public openDialog(): void {
    this.dialogVisible = true;
  }

  public onDialogClose(): void {}

  public checkIsIndicatorSelected(
    indicator: ChartTechnicalIndicators,
  ): boolean {
    if (!this.selectedChartIndicators?.length) {
      return false;
    }
    return this.selectedChartIndicators?.some((i) => i.name === indicator.name);
  }

  public selectIndicator(indicator: ChartTechnicalIndicators): void {
    const indicators = JSON.parse(JSON.stringify(this.selectedChartIndicators));
    const index = indicators.findIndex(
      (i: ChartTechnicalIndicators) => i.name === indicator.name,
    );
    if (index === -1) {
      indicators.push(indicator);
    } else {
      indicators.splice(index, 1);
    }

    this.selectTechnicalIndicator.emit(indicators);
  }
}
