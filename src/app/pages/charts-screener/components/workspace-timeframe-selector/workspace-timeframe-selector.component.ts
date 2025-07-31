import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { getTimeframes, Timeframe } from '../../../../shared/models/Timeframe';

@Component({
  selector: 'app-workspace-timeframe-selector',
  templateUrl: './workspace-timeframe-selector.component.html',
  styleUrls: ['./workspace-timeframe-selector.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropdownModule, OverlayPanelModule, NgForOf],
})
export class WorkspaceTimeframeSelectorComponent {
  @Input()
  public selectedTimeframe: string = '5m';

  @Output()
  public changeTimeFrame: EventEmitter<Timeframe> =
    new EventEmitter<Timeframe>();

  public timeframes = getTimeframes(this.translateService);
  constructor(private readonly translateService: TranslateService) {}

  public selectTimeframe(value: Timeframe, panel: OverlayPanel): void {
    this.changeTimeFrame.emit(value);
    panel.hide();
  }
}
