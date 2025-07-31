import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {SplitButtonModule} from 'primeng/splitbutton';
import {DataLoaderMode} from '../../../../types/base.types';

@Component({
  selector: 'app-chart-update-mode-switcher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    FormsModule,
    SplitButtonModule,
  ],
  templateUrl: './chart-update-mode-switcher.html',
  styleUrls: ['./chart-update-mode-switcher.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartUpdateModeSwitcherComponent {
  @Input()
  private mode: DataLoaderMode = 'auto';

  @Output()
  public switchDataLoaderMode: EventEmitter<DataLoaderMode> =
    new EventEmitter<DataLoaderMode>();

  @Output()
  public dataLoadButtonClick = new EventEmitter();

  public dataLoadButtonDisabled = false;

  public modeOptions = [
    {
      label: 'Авто',
      command: () => {
        this.switchDataLoaderMode.emit('auto');
      },
    },
    {
      label: 'По клику',
      command: () => {
        this.switchDataLoaderMode.emit('manual');
      },
    },
  ];

  constructor(private cdr: ChangeDetectorRef) {
  }

  public getReadableTitle(): string {
    return this.mode === 'auto' ? 'Авто' : 'Вручную';
  }

  public getIcon(): string {
    return this.mode === 'auto' ? '' : 'pi pi-refresh';
  }

  public onLoaderButtonClick() {
    if (this.mode === 'manual') {
      this.dataLoadButtonDisabled = true;

      this.dataLoadButtonClick.emit();
      setTimeout(() => {
        this.dataLoadButtonDisabled = false;
        this.cdr.detectChanges();
      }, 1000);
    }
  }
}
