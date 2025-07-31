import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {
  AlertIntervalOptions,
  AlertIntervalType,
  VolumeSplashAlertIntervalType,
} from '../../models/Alert';
import { DropdownOptions, FilterIntervalType } from '../../types/base.types';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interval-selector',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, DropdownModule, FormsModule, TranslateModule],
  templateUrl: './interval-selector.component.html',
  styleUrls: ['./interval-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIntervalSelectorComponent {
  @Output()
  public intervalChange: EventEmitter<AlertIntervalType> =
    new EventEmitter<AlertIntervalType>();

  @Input()
  public selectedInterval: FilterIntervalType = 'interval_5m';

  @Input()
  public disabled: boolean = false;

  @Input()
  public readonly options: DropdownOptions<
    AlertIntervalType | VolumeSplashAlertIntervalType
  > = AlertIntervalOptions(this.translateService);

  constructor(private translateService: TranslateService) {
  }

  public handleIntervalChange(event: DropdownChangeEvent): void {
    this.intervalChange.emit(event.value);
  }
}
