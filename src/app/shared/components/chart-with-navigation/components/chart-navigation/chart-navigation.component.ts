import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CoinSortingType, SortingId } from '../../../../models/CoinsSorting';
import { SortingDirection } from '../../../../models/Sorting';
import { WatchlistCoin } from '../../../../models/Watchlist';
import { WorkspaceCoins } from '../../../../models/WorkspaceCoins';
import { ChartNavigationCoinRowComponent } from '../chart-navigation-coin-row/chart-navigation-coin-row.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChartSettings } from 'src/app/shared/models/ChartSettings';
import { PremiumMessageBannerComponent } from '../../../premium-message-banner/premium-message-banner.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-chart-navigation',
  standalone: true,
  imports: [
    CommonModule,
    ChartNavigationCoinRowComponent,
    ScrollerModule,
    TranslateModule,
    ScrollPanelModule,
    PremiumMessageBannerComponent,
  ],
  templateUrl: './chart-navigation.component.html',
  styleUrls: ['./chart-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChartNavigationComponent implements OnChanges {
  @Input()
  public selectedCoin: string;

  @Input()
  public wathclist: WatchlistCoin[] = [];

  @Input()
  public columnsData: CoinSortingType[] = [];

  @Input()
  public coins: WorkspaceCoins[] = [];

  @Input()
  public activeSortingId: SortingId;

  @Input()
  public sortByAlerts: boolean = false;

  @Input()
  public autoSize: boolean = false;

  @Input()
  public showPScroller: boolean = false;

  @Input()
  public sortingDirection: SortingDirection;

  @Input()
  public chartSettings: ChartSettings;

  @Input()
  public disableSorting: boolean = false;

  @Input()
  public premium: boolean;

  @Input()
  public popupFromWorkspace: boolean;

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

  public columns: CoinSortingType[] = [];
  public showLimitOrdersMarker: boolean = false;

  @ViewChild('headerRow', { static: false })
  private headerRow!: ElementRef<HTMLDivElement>;
  @ViewChild('dataRow', { static: false })
  private dataRow!: ElementRef<HTMLDivElement>;

  constructor(public ref: DynamicDialogRef) {}

  public ngOnChanges({ columnsData }: SimpleChanges) {
    if (columnsData) {
      this.columns = this.getFilteredColumns();
      this.showLimitOrdersMarker = !!this.columnsData.find(
        (c: CoinSortingType) => c.id === 'LimitOrders',
      );
    }
  }

  public get showSortingByAlerts(): boolean {
    return !!this.columnsData.find((c) => c.id === 'Alert');
  }

  public get showSortingByWatchlist(): boolean {
    return !!this.columnsData.find((c) => c.id === 'Watchlist');
  }

  public close(): void {
    this.ref.close();
  }

  private getFilteredColumns(): CoinSortingType[] {
    return this.columnsData.filter((c) => {
      return c.id !== 'Alert' && c.id !== 'Watchlist' && c.id !== 'LimitOrders';
    });
  }
}
