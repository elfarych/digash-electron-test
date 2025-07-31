import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTriggerDirective } from '../menu/menu-trigger.directive';
import { MenuComponent } from '../menu/menu.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ChartSettingsType } from '../../types/base.types';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-default-settings-button',
  standalone: true,
  imports: [
    CommonModule,
    MenuTriggerDirective,
    SvgIconComponent,
    MenuComponent,
    DropdownModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './default-settings-button.component.html',
  styleUrls: ['./default-settings-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultSettingsButtonComponent {
  @Input()
  private chartSettingsType: ChartSettingsType = 'all';

  @Input()
  public label = 'Сбросить настройки';

  @Output()
  public setDefaultSettings: EventEmitter<ChartSettingsType> =
    new EventEmitter<ChartSettingsType>();

  public onClick(): void {
    this.setDefaultSettings.emit(this.chartSettingsType);
  }
}
