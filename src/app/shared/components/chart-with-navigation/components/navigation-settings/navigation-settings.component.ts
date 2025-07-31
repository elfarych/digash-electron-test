import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTriggerDirective } from '../../../menu/menu-trigger.directive';
import { MenuComponent } from '../../../menu/menu.component';
import {
  CoinSortingType,
  correlationSorting,
  priceChangeSorting,
  SortingId,
  tradesSorting,
  volatilitySorting,
  volumeSorting,
} from '../../../../models/CoinsSorting';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CoinSearchComponent } from '../coin-search/coin-search.component';
import { WorkspaceCoins } from '../../../../models/WorkspaceCoins';
import { ChartSettingsComponent } from '../chart-settings/chart-settings.component';
import { ChartSettings } from '../../../../models/ChartSettings';
import { SvgIconComponent } from 'angular-svg-icon';
import { ExchangeSelectorComponent } from '../../../exchange-selector/exchange-selector.component';
import { Exchange } from '../../../../models/Exchange';
import { ChartUpdateModeSwitcherComponent } from '../chart-update-mode-switcher/chart-update-mode-switcher';
import { DataLoaderMode } from '../../../../types/base.types';
import { Preset } from '../../../../models/Preset';
import { PresetsComponent } from '../../../presets/presets.component';

@Component({
  selector: 'app-navigation-settings',
  standalone: true,
  imports: [
    CommonModule,
    MenuTriggerDirective,
    MenuComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    CoinSearchComponent,
    ChartSettingsComponent,
    SvgIconComponent,
    ExchangeSelectorComponent,
    ChartUpdateModeSwitcherComponent,
    PresetsComponent,
  ],
  templateUrl: './navigation-settings.component.html',
  styleUrls: ['./navigation-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSettingsComponent {
  @Input()
  public selectedColumns: CoinSortingType[] = [];

  @Input()
  public coins: WorkspaceCoins[] = [];

  @Input()
  public activeSortingId: SortingId;

  @Input()
  public allCoins: WorkspaceCoins[] = [];

  @Input()
  public standaloneChart = false;

  @Input()
  public coinNavigationAutoSize;

  @Input()
  public chartSettings: ChartSettings;

  @Input()
  public dataLoaderMode: DataLoaderMode;

  @Input()
  public isPremium: boolean = false;

  @Input()
  public presets: Preset[] = [];

  @Input()
  public selectedPreset: Preset;

  @Output()
  public columnSelectionChange: EventEmitter<SortingId> =
    new EventEmitter<SortingId>();

  @Output()
  public selectSymbol: EventEmitter<WorkspaceCoins> =
    new EventEmitter<WorkspaceCoins>();

  @Output()
  public chartSettingsChange: EventEmitter<ChartSettings> =
    new EventEmitter<ChartSettings>();

  @Output()
  public switchDataLoaderMode: EventEmitter<DataLoaderMode> =
    new EventEmitter<DataLoaderMode>();

  @Output()
  public dataLoadButtonClick = new EventEmitter();

  @Output()
  public resetNavigationColumns = new EventEmitter();

  @Output()
  public toggleNavigationAutoSize = new EventEmitter();

  @Output()
  public excludeExchanges: EventEmitter<Exchange[]> = new EventEmitter<
    Exchange[]
  >();

  @Output()
  public selectPreset: EventEmitter<Preset> = new EventEmitter<Preset>();

  @Output()
  public editPreset: EventEmitter<Preset> = new EventEmitter<Preset>();

  @Output()
  public createPreset: EventEmitter<Partial<Preset>> = new EventEmitter<
    Partial<Preset>
  >();

  @Output()
  public deletePreset: EventEmitter<number> = new EventEmitter<number>();

  public volumeColumns = volumeSorting;
  public volumeOpened = false;

  public priceChangeColumns = priceChangeSorting;
  public priceChange = false;

  public correlationColumns = correlationSorting;
  public correlationChange = false;

  public volatilityColumns = volatilitySorting;
  public volatilityChange = false;

  public tradesColumns = tradesSorting;
  public tradesChange = false;

  public exchangeChange(exchange: Exchange): void {
    this.chartSettingsChange.emit({ ...this.chartSettings, market: exchange });
  }

  public columnIsSelected(columnId: SortingId): boolean {
    return !!this.selectedColumns.find(
      (column: CoinSortingType) => column.id === columnId,
    );
  }

  public selectionChange(id: SortingId): void {
    this.columnSelectionChange.emit(id);
  }

  public handleSelectSymbol(symbol: string): void {
    const coinData = this.allCoins.find((coin) => coin.symbol === symbol);
    this.selectSymbol.emit(coinData);
  }
}
