import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import {
  Listing,
  ListingOpenChartParams,
} from '../../utils/models/listing.model';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { getExchangeData } from '../../../../shared/models/Exchange';
import { SvgIconComponent } from 'angular-svg-icon';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AlertNotification } from '../../../../shared/models/Notification';
import { ListingService } from '../../listing.service';
import { TooltipsComponent } from 'src/app/shared/components/tooltips/tooltips.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {SymbolPipe} from "../../../../shared/pipes/symbol.pipe";

@Component({
  selector: 'app-listing-table',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule,
    SharedModule,
    TableModule,
    SvgIconComponent,
    TooltipsComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SymbolPipe
  ],
  templateUrl: './listing-table.component.html',
  styleUrls: ['./listing-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public listings: Listing[] = [];

  @Output()
  public openChart: EventEmitter<ListingOpenChartParams> =
    new EventEmitter<ListingOpenChartParams>();

  public listingsData: Listing[] = [];
  public searchControl = new FormControl('');

  private subscriptions: Subscription = new Subscription();

  protected readonly getExchangeData = getExchangeData;

  constructor(
    private cdr: ChangeDetectorRef,
    private service: ListingService,
    private translateService: TranslateService,
    @Optional()
    @Inject(DynamicDialogConfig)
    public data?: {
      data: {
        dialog: true;
        notifications: AlertNotification[];
      };
    },
  ) {}

  public ngOnInit() {
    if (this.data?.data) {
      this.listingsData = this.data.data.notifications.map((item) => {
        return {
          symbol: item.symbol,
          market: item.exchange,
          created_at: item.created_at,
        } as unknown as Listing;
      });
      this.cdr.detectChanges();
    } else {
      this.listingsData = JSON.parse(JSON.stringify(this.listings));
    }

    this.subscriptions.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(500))
        .subscribe((value) => {
          this.listingsData = JSON.parse(JSON.stringify(this.listings)).filter(
            (i: Listing) =>
              i.symbol.toLowerCase().includes(value?.toLowerCase()),
          );
        }),
    );
  }

  public ngOnChanges({ listings }: SimpleChanges) {
    if (listings) {
      this.listingsData = JSON.parse(JSON.stringify(listings.currentValue));
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public get locale(): string {
    return this.translateService.currentLang;
  }

  public openChartDialog({ symbol, exchange }: ListingOpenChartParams): void {
    if (this.data?.data?.dialog) {
      this.service.openChart(symbol, exchange);
    }
    this.openChart.emit({ symbol, exchange });
  }
}
