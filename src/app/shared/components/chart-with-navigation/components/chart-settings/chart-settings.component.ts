import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTriggerDirective } from '../../../menu/menu-trigger.directive';
import { MenuComponent } from '../../../menu/menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExchangeSelectorComponent } from '../../../exchange-selector/exchange-selector.component';
import { ChartSettings } from '../../../../models/ChartSettings';
import { ConvertPricePipe } from '../../../../pipes/convert-price.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getReadableTrendLineSourceName } from 'src/app/shared/utils/getReadableTrendLineSourceName';
import { SvgIconComponent } from 'angular-svg-icon';
import { ChartLevelSettingsFormComponent } from '../../../chart-level-settings-form/chart-level-settings-form.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CoinSortingType, SortingId } from '../../../../models/CoinsSorting';
import { PremiumForbiddenDirective } from '../../../../directives/premium-forbidden.directive';
import { WorkspaceCoins } from '../../../../models/WorkspaceCoins';
import { Exchange } from '../../../../models/Exchange';

@Component({
  selector: 'app-chart-settings',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    MenuTriggerDirective,
    MenuComponent,
    ReactiveFormsModule,
    ExchangeSelectorComponent,
    ConvertPricePipe,
    MatTooltipModule,
    SvgIconComponent,
    ButtonModule,
    DialogModule,
    ChartLevelSettingsFormComponent,
    PremiumForbiddenDirective,
  ],
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartSettingsComponent {
  @Output()
  public chartSettingsChange: EventEmitter<ChartSettings> =
    new EventEmitter<ChartSettings>();

  @Output()
  public columnSelectionChange: EventEmitter<SortingId> =
    new EventEmitter<SortingId>();

  @Output()
  public toggleNavigationAutoSize = new EventEmitter();

  @Output()
  public resetNavigationColumns = new EventEmitter();

  @Input()
  public chartSettings: ChartSettings;

  @Input()
  public activeSortingId: SortingId;

  @Input()
  public coinNavigationAutoSize;

  @Input()
  public selectedColumns: CoinSortingType[] = [];

  @Input()
  public isPremium: boolean = false;

  @Input()
  public coins: WorkspaceCoins[] = [];

  @Output()
  public excludeExchanges: EventEmitter<Exchange[]> = new EventEmitter<
    Exchange[]
  >();

  public visible = false;

  constructor() {}

  public showDialog(): void {
    this.visible = true;
  }

  public getReadableTrendLineSourceName(value: 'high/low' | 'close'): string {
    return getReadableTrendLineSourceName(value);
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent): void {
    if (event.shiftKey && event.code.toLowerCase() === 'keys') {
      this.showDialog();
    }
  }
}
