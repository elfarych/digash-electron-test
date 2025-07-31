import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workspace } from '../../../../shared/models/Workspace';
import { MiniChartComponent } from '../../../../shared/components/mini-chart/mini-chart.component';
import { WorkspaceCoins } from '../../../../shared/models/WorkspaceCoins';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatRippleModule } from '@angular/material/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { WorkspaceService } from '../../data-access/workspace.service';
import Splide from '@splidejs/splide';
import { Preferences } from '../../../../shared/models/Preferences';
import {
  allSortingColumns,
  CoinSortingType,
} from '../../../../shared/models/CoinsSorting';
import { ConvertPricePipe } from '../../../../shared/pipes/convert-price.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollTopComponent } from '../../../../shared/components/scroll-top/scroll-top.component';
import { Alert } from '../../../../shared/models/Alert';
import { MiniChartVirtualWrapperComponent } from '../../../../shared/components/mini-chart/components/mini-chart-virtual-wrapper/mini-chart-virtual-wrapper.component';
import { WatchlistCoin } from '../../../../shared/models/Watchlist';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ScrollerModule } from 'primeng/scroller';
import { ButtonModule } from 'primeng/button';
import { PremiumForbiddenDirective } from '../../../../shared/directives/premium-forbidden.directive';
import { BlockUIModule } from 'primeng/blockui';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/data-access/auth.service';
import { Observable, of } from 'rxjs';
import { UserData } from '../../../../shared/models/Auth';
import { ChartTechnicalIndicators } from '../../../../shared/models/chart-indicators/ChartIndicators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressSpinnerComponent } from 'src/app/shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    MiniChartComponent,
    ScrollingModule,
    MatRippleModule,
    SvgIconComponent,
    ConvertPricePipe,
    MatSnackBarModule,
    ScrollTopComponent,
    MiniChartVirtualWrapperComponent,
    ScrollTopModule,
    ScrollerModule,
    ButtonModule,
    PremiumForbiddenDirective,
    BlockUIModule,
    TranslateModule,
    ProgressSpinnerComponent,
  ],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input()
  public workspace: Workspace;

  @Input()
  public coins: WorkspaceCoins[];

  @Input()
  public preferences: Preferences;

  @Input()
  public alerts: Alert[];

  @Input()
  public loading: boolean;

  @Input()
  public multipleWorkspaces: boolean = false;

  @Output()
  public candlesLenUpdated: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public chartIndicatorsUpdated: EventEmitter<ChartTechnicalIndicators[]> =
    new EventEmitter<ChartTechnicalIndicators[]>();

  @ViewChild('workspaceRef', { static: false })
  public workspaceRef: ElementRef<HTMLElement>;

  public coinLineData: CoinSortingType;
  public userData$: Observable<UserData> = this.authService.getUserData();
  public watchlistCoins$: Observable<WatchlistCoin[]> = of([]);
  public chartHeight: string = '90vh';
  public showAlertIcon: boolean = false;

  private splide: Splide;

  constructor(
    public elementRef: ElementRef,
    private router: Router,
    private service: WorkspaceService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private translateService: TranslateService,
  ) {}

  public ngOnChanges({ preferences, workspace }: SimpleChanges): void {
    if (preferences) {
      this.updateLayout();
    }

    if (workspace) {
      if (this.workspace) {
        this.watchlistCoins$ = this.service.getWatchlist(this.workspace.market);
        this.showAlertIcon = this.workspace.sortByAlerts;
      }
    }
  }

  public ngOnDestroy(): void {}

  public ngAfterViewInit(): void {
    this.updateLayout();
    this.chartIdentity = this.chartIdentity.bind(this);
    this.watchlistCoins$ = this.service.getWatchlist(this.workspace?.market);
  }

  public redirectToPremium(): void {
    this.router.navigate(['app', 'premium']);
  }

  public openCoin(coin: WorkspaceCoins): void {
    this.service.openChart(
      coin.symbol,
      this.workspace,
      coin.data,
      this.coins,
      this.preferences,
    );
  }

  public chartIdentity(index: number, value: WorkspaceCoins): number | string {
    return `${value.symbol} - ${this.workspace?.id}`;
  }

  public slideIdentity(index: number, value: WorkspaceCoins): number | string {
    return value.symbol;
  }

  private getCoinKeys(): void {
    this.coinLineData = allSortingColumns(this.translateService).find(
      (option) => option.id === this.preferences.lineValue,
    );
    this.cdr.detectChanges();
  }

  private updateLayout(): void {
    if (!this.workspaceRef) {
      return void 0;
    }

    if (window.innerHeight <= 1800) {
      switch (this.preferences.layout) {
        case '2c':
          this.chartHeight = '45vh';
          this.chartHeight = `calc(${this.chartHeight} - 26px)`;
          break;
        case '3c':
        case '4c':
        case '5c':
          this.chartHeight = '30vh';
          this.chartHeight = `calc(${this.chartHeight} - 18px)`;
          break;
        default:
          this.chartHeight = '90vh';
          this.chartHeight = `calc(${this.chartHeight} - 42px)`;
      }
    } else {
      if (window.innerHeight > 1800) {
        const height = Math.min(600, window.innerWidth / 2);
        this.chartHeight = height + 'px';
      } else {
        const height = Math.min(300, window.innerWidth / 2);
        this.chartHeight = height + 'px';
      }

      this.chartHeight = `calc(${this.chartHeight} - 20px)`;
    }

    this.workspaceRef.nativeElement.style.gridTemplateColumns = `repeat(${parseInt(this.preferences.layout)}, minmax(100px, 1fr))`;
    this.workspaceRef.nativeElement.style.gridTemplateRows = `repeat(${parseInt(this.preferences.layout)}, ${this.chartHeight})`;
  }

  protected readonly String = String;
}
