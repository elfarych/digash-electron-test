import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceCoins } from '../../../../models/WorkspaceCoins';
import { normalizeCoinQuoteSymbol } from '../../../../utils/normalizeCoinQuoteSymbol';
import { WatchlistSelectionComponent } from '../../../watchlist-selection/watchlist-selection.component';
import { CoinSortingType, SortingId } from '../../../../models/CoinsSorting';
import { WatchlistCoin, WatchlistColor } from '../../../../models/Watchlist';
import { ConvertPricePipe } from '../../../../pipes/convert-price.pipe';
import { ConvertBigNumberPipe } from '../../../../pipes/convert-big-number.pipe';
import { getLimitOrderFilterMatch } from 'src/app/shared/utils/getLimitOrderFilterMatch';
import { ChartSettings } from 'src/app/shared/models/ChartSettings';
import { SortingTypeRange } from '../../../../models/Sorting';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-navigation-coin-row',
  standalone: true,
  imports: [
    CommonModule,
    WatchlistSelectionComponent,
    ConvertPricePipe,
    ConvertBigNumberPipe,
  ],
  templateUrl: './chart-navigation-coin-row.component.html',
  styleUrls: ['./chart-navigation-coin-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartNavigationCoinRowComponent implements OnChanges {
  @Input()
  public hasAlert: boolean = false;

  @Input()
  public selectedCoin: string;

  @Input()
  public autoSize: boolean = false;

  @Input()
  public coin: WorkspaceCoins;

  @Input()
  public coinsNavigationColumns: CoinSortingType[];

  @Input()
  public watchlistCoins: WatchlistCoin[];

  @Input()
  public showAlertColumn: boolean;

  @Input()
  public showWatchlistColumn: boolean;

  @Input()
  public activeSortingId: SortingId;

  @Input()
  public sortByAlerts: boolean = false;

  @Input()
  public chartSettings: ChartSettings;

  @Input()
  public showLimitOrdersMarker: boolean;

  @Output()
  public selectColor: EventEmitter<string> = new EventEmitter<string>();

  public watchlistCoin: WatchlistCoin;
  public hasAskLimitOrder: boolean = false;
  public hasBidLimitOrder: boolean = false;

  constructor(private readonly translateService: TranslateService) {}

  public ngOnChanges({
    coin,
    watchlistCoins,
    chartSettings,
  }: SimpleChanges): void {
    if (coin || chartSettings) {
      this.limitOrdersExist();
    }

    this.handleWatchlistCoin();
  }

  public handleSelectColor(color: WatchlistColor): void {
    this.selectColor.emit(color);
  }

  public limitOrdersExist(): void {
    this.hasAskLimitOrder = [...this.coin.data.a].some((limitOrder) =>
      getLimitOrderFilterMatch(limitOrder, this.chartSettings),
    );
    this.hasBidLimitOrder = [...this.coin.data.b].some((limitOrder) =>
      getLimitOrderFilterMatch(limitOrder, this.chartSettings),
    );
  }

  public getVolumeSplashField(sortingRange: SortingTypeRange): string {
    const valuesMap: { [key: string]: string } = {
      '5m': 'volumeIdx2h_5m',
      '15m': 'volumeIdx2h_15m',
      '30m': 'volumeIdx2h_30m',
      '1h': 'volumeIdx2h_1h',
      '2h': 'volumeIdx24h_2h',
      '6h': 'volumeIdx24h_6h',
      '12h': 'volumeIdx24h_12h',
      '24h': 'volumeIdx7d_24h',
    };

    return valuesMap[sortingRange];
  }

  public convertListing(value: string): string {
    if (!value) {
      return '-';
    }

    const now = new Date();
    const valueDate = new Date(value);
    const diffMs = now.getTime() - valueDate.getTime();

    let days = 0;
    let hours = 0;

    if (diffMs <= 0) {
      days = 0;
      hours = 0;
    } else {
      days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const remainingMs = diffMs % (1000 * 60 * 60 * 24);
      hours = Math.floor(remainingMs / (1000 * 60 * 60));
    }

    return `${days}${this.translateService.instant('sorting.shortDays')} ${hours}${this.translateService.instant('sorting.shortHours')}`;
  }

  private handleWatchlistCoin(): void {
    this.watchlistCoin = this.watchlistCoins.find(
      (coin) => coin.symbol === this.coin.symbol,
    );
  }

  protected readonly normalizeCoinQuoteSymbol = normalizeCoinQuoteSymbol;
}
