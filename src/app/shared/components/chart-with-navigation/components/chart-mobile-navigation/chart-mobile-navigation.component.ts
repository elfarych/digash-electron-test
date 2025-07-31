import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Exchange,
  ExchangeData,
  getExchangeData,
} from '../../../../models/Exchange';
import { SvgIconComponent } from 'angular-svg-icon';
import { normalizeCoinQuoteSymbol } from '../../../../utils/normalizeCoinQuoteSymbol';
import { NavigationSettingsComponent } from '../navigation-settings/navigation-settings.component';
import { ChartNavigationComponent } from '../chart-navigation/chart-navigation.component';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { CoinSortingType, SortingId } from '../../../../models/CoinsSorting';
import { WorkspaceCoins } from '../../../../models/WorkspaceCoins';
import { ChartSettings } from '../../../../models/ChartSettings';
import { DataLoaderMode } from '../../../../types/base.types';
import { Preset } from '../../../../models/Preset';
import { WatchlistCoin } from '../../../../models/Watchlist';
import { SortingDirection } from '../../../../models/Sorting';
import { ChartIndicatorsSelectionComponent } from '../../../chart-indicators-selection/chart-indicators-selection.component';
import { ChartTechnicalIndicators } from '../../../../models/chart-indicators/ChartIndicators';

@Component({
  selector: 'app-chart-mobile-navigation',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    NavigationSettingsComponent,
    ChartNavigationComponent,
    ProgressSpinnerComponent,
    ChartIndicatorsSelectionComponent,
  ],
  templateUrl: './chart-mobile-navigation.component.html',
  styleUrls: ['./chart-mobile-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartMobileNavigationComponent implements OnChanges {
  @Input()
  public selectedCoin: string;

  @Input()
  public exchange: Exchange;

  @Input()
  public selectedColumns: CoinSortingType[] = [];

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
  public loading: boolean = false;

  @Input()
  public presets: Preset[] = [];

  @Input()
  public selectedPreset: Preset;

  @Input()
  public wathclist: WatchlistCoin[] = [];

  @Input()
  public columnsData: CoinSortingType[] = [];

  @Input()
  public coins: WorkspaceCoins[] = [];

  @Input()
  public sortByAlerts: boolean = false;

  @Input()
  public autoSize: boolean = false;

  @Input()
  public showPScroller: boolean = false;

  @Input()
  public sortingDirection: SortingDirection;

  @Input()
  public disableSorting: boolean = false;

  @Input()
  public premium: boolean;

  @Input()
  public popupFromWorkspace: boolean;

  @Input()
  public chartIndicators: ChartTechnicalIndicators[];

  @Output()
  public selectTechnicalIndicator: EventEmitter<ChartTechnicalIndicators[]> =
    new EventEmitter<ChartTechnicalIndicators[]>();

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

  @Output()
  public updateSorting: EventEmitter<SortingId> = new EventEmitter<SortingId>();

  @Output()
  public selectCoin: EventEmitter<WorkspaceCoins> =
    new EventEmitter<WorkspaceCoins>();

  @Output()
  public toggleSortingByAlerts: EventEmitter<void> = new EventEmitter();

  @Output()
  public selectColor: EventEmitter<{
    color: string;
    symbol: string;
  }> = new EventEmitter<{ color: string; symbol: string }>();

  @ViewChild('navigationContainer') navigationRef!: ElementRef;

  public exchangeData: ExchangeData;
  public showMenu: boolean = false;

  private touchStartY: number = 0;
  private touchStartX: number = 0;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  public ngOnChanges({ exchange }: SimpleChanges) {
    if (exchange) {
      this.exchangeData = getExchangeData(exchange.currentValue);
    }
  }

  public get navigationStyle(): Record<string, string> {
    return {
      marginBottom: this.showMenu ? '0px' : '-70vh',
    };
  }

  public toggleMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.showMenu = !this.showMenu;
    this.cdr.detectChanges();
  }

  public onCoinSelect(coin: WorkspaceCoins): void {
    this.showMenu = false;
    this.selectCoin.emit(coin);
  }

  @HostListener('document:click', ['$event'])
  private onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.navigationRef.nativeElement.contains(
      event.target,
    );
    if (!clickedInside && this.showMenu) {
      this.showMenu = !this.showMenu;
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.changedTouches[0].clientY;
    this.touchStartX = event.changedTouches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    const touchEndY = event.changedTouches[0].clientY;
    const touchEndX = event.changedTouches[0].clientX;
    const deltaY = touchEndY - this.touchStartY;
    const deltaX = touchEndX - this.touchStartX;

    if (Math.abs(deltaY) > 30) {
      if (deltaY < 0 && !this.showMenu) {
        this.showMenu = true;
      }
    }

    if (Math.abs(deltaX) > 30) {
      this.changeSelectedCoin(deltaX > 0 ? 1 : -1);
    }
  }

  private changeSelectedCoin(changeIndexValue: -1 | 1): void {
    const currentCoinIndex = this.coins.findIndex(
      (c) => c.symbol === this.selectedCoin,
    );

    if (currentCoinIndex !== -1) {
      if (changeIndexValue === -1 && currentCoinIndex === 0) {
        return void 0;
      }

      this.selectCoin.emit(this.coins[currentCoinIndex + changeIndexValue]);
    }
  }

  protected readonly normalizeCoinQuoteSymbol = normalizeCoinQuoteSymbol;
}
