import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { ListboxClickEvent, ListboxModule } from 'primeng/listbox';
import {
  CoinSortingType,
  correlationSorting,
  horizontalLevelsSorting,
  otherSorting,
  priceChangeSorting,
  SortingId,
  tradesSorting,
  trendLevelsSorting,
  volatilitySorting,
  volumeSorting,
  volumeSplashSorting,
} from '../../../../models/CoinsSorting';
import { FormsModule } from '@angular/forms';
import { PremiumMessageBannerComponent } from '../../../premium-message-banner/premium-message-banner.component';
import { TooltipsComponent } from '../../../tooltips/tooltips.component';
import { CheckboxModule } from 'primeng/checkbox';
import { NavigationColumnSelectionComponent } from '../navigation-column-selection/navigation-column-selection.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation-columns-settings',
  standalone: true,
  imports: [
    CommonModule,
    FieldsetModule,
    ListboxModule,
    FormsModule,
    PremiumMessageBannerComponent,
    TooltipsComponent,
    CheckboxModule,
    NavigationColumnSelectionComponent,
    TranslateModule,
  ],
  templateUrl: './navigation-columns-settings.component.html',
  styleUrls: ['./navigation-columns-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationColumnsSettingsComponent implements OnInit, OnChanges {
  @Output()
  public columnSelectionChange: EventEmitter<SortingId> =
    new EventEmitter<SortingId>();

  @Input()
  public selectedColumns: CoinSortingType[] = [];

  @Input()
  public isPremium: boolean = false;

  public commonColumns;
  public volumeColumns;
  public priceChangeColumns;
  public correlationColumns;
  public volatilityColumns;
  public tradesColumns;
  public horizontalLevelsColumns;
  public trendLevelsColumns;
  public volumeSplashColumns;

  public selectedColumnIds: SortingId[];

  constructor(private translateService: TranslateService) {}

  public ngOnInit(): void {
    this.initColumns();
  }

  public ngOnChanges({ selectedColumns }: SimpleChanges) {
    if (selectedColumns) {
      this.initColumns();
    }
  }

  public handleColumnSelection(event: ListboxClickEvent): void {
    this.columnSelectionChange.emit(event.option.id);
  }

  public columnSelected(id: SortingId): void {
    this.columnSelectionChange.emit(id);
  }

  private initColumns(): void {
    this.selectedColumnIds = this.selectedColumns.map((column) => column.id);

    this.commonColumns = otherSorting(this.translateService).map((col) => {
      col['isDisabled'] = !this.isPremium && (col.id === 'LimitOrders' || col.id === 'Funding' || col.id === 'Listing');
      return col;
    });

    this.volumeColumns = volumeSorting(this.translateService).map((col) => {
      col['isDisabled'] = !this.isPremium && !col.trendSubType.includes('24h');
      return col;
    });

    this.volumeSplashColumns = volumeSplashSorting(this.translateService).map(
      (col) => {
        col['isDisabled'] = !this.isPremium;
        return col;
      },
    );

    this.priceChangeColumns = priceChangeSorting(this.translateService).map(
      (col) => {
        col['isDisabled'] = !this.isPremium && !col.trendSubType.includes('24h');
        return col;
      },
    );

    this.correlationColumns = correlationSorting(this.translateService).map(
      (col) => {
        col['isDisabled'] =
          !this.isPremium && !col.trendSubType.includes('24h');
        return col;
      },
    );

    this.volatilityColumns = volatilitySorting(this.translateService).map(
      (col) => {
        col['isDisabled'] =
          !this.isPremium && !col.trendSubType.includes('24h');
        return col;
      },
    );

    this.tradesColumns = tradesSorting(this.translateService).map((col) => {
      col['isDisabled'] = !this.isPremium && !col.trendSubType.includes('24h');
      return col;
    });

    this.horizontalLevelsColumns = horizontalLevelsSorting(
      this.translateService,
    ).map((col) => {
      col['isDisabled'] = !this.isPremium;
      return col;
    });

    this.trendLevelsColumns = trendLevelsSorting(this.translateService).map(
      (col) => {
        col['isDisabled'] = !this.isPremium;
        return col;
      },
    );
  }
}
