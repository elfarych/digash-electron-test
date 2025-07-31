import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectButtonChangeEvent } from 'primeng/selectbutton/selectbutton.interface';
import { getTimeframes, Timeframe } from '../../models/Timeframe';
import { getMultiTimeframes } from '../../utils/getMultiTimeframes';

@Component({
  selector: 'app-interval-multi-selector',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorModule,
    ReactiveFormsModule,
    SelectButtonModule,
    TranslateModule,
  ],
  templateUrl: './interval-multi-selector.component.html',
  styleUrls: ['./interval-multi-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalMultiSelectorComponent {
  @Input()
  public isPremium: boolean = false;

  @Input()
  public currentTimeframe: Timeframe;

  @Input()
  public selectedIntervals: Timeframe[] = [];

  @Output()
  public selectedIntervalsChange: EventEmitter<Timeframe[]> = new EventEmitter<
    Timeframe[]
  >();

  public timeframes = getTimeframes(this.translateService);

  constructor(private readonly translateService: TranslateService) {}

  public get options() {
    const availableTimeframes = getMultiTimeframes(this.currentTimeframe);
    return this.timeframes.filter((t) => availableTimeframes.includes(t.name));
  }

  public onIntervalsChange(event: SelectButtonChangeEvent): void {
    this.selectedIntervalsChange.emit(event.value);
  }
}
