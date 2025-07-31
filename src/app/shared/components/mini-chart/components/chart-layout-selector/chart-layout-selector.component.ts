import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import {
  ChartLayout,
  chartLayoutOptions,
  getChartLayoutOptions,
} from '../../models/ChartLayout';
import { SplitButtonModule } from 'primeng/splitbutton';
import {OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-chart-layout-selector',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    SplitButtonModule,
    OverlayPanelModule,
  ],
  templateUrl: './chart-layout-selector.component.html',
  styleUrls: ['./chart-layout-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLayoutSelectorComponent {
  @Input()
  public layout: ChartLayout = 'single';

  @Output()
  private layoutChanged: EventEmitter<ChartLayout> = new EventEmitter<ChartLayout>();

  public layoutOptions = getChartLayoutOptions();
  protected readonly chartLayoutOptions = chartLayoutOptions;

  public changeChartLayout(layout: ChartLayout, op: OverlayPanel): void {
    this.layoutChanged.emit(layout);
    op.hide();
  }
}
