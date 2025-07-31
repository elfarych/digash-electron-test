import {
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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniChartComponent } from '../../mini-chart.component';
import { Exchange } from '../../../../models/Exchange';
import { CoinData } from '../../../../models/CoinData';
import { Preferences } from '../../../../models/Preferences';
import { Timeframe } from '../../../../models/Timeframe';
import { ChartSettings } from '../../../../models/ChartSettings';
import { Formations } from '../../../../models/Formations';
import { Alert } from '../../../../models/Alert';
import { WatchlistCoin } from '../../../../models/Watchlist';
import { ChartTechnicalIndicators } from '../../../../models/chart-indicators/ChartIndicators';
import { UserData } from '../../../../models/Auth';
import { BlockUIModule } from 'primeng/blockui';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NightVisionChartService } from '../../../night-vision-chart/night-vision-chart.service';

@Component({
  selector: 'app-mini-chart-virtual-wrapper',
  standalone: true,
  imports: [CommonModule, MiniChartComponent, BlockUIModule, ButtonModule],
  templateUrl: './mini-chart-virtual-wrapper.component.html',
  styleUrls: ['./mini-chart-virtual-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniChartVirtualWrapperComponent implements OnChanges, OnDestroy {
  @Input()
  public hasAlert: boolean = false;

  @Input()
  public showAlertIcon: boolean = false;

  @Input()
  public chartId: string;

  @Input()
  public coin: string;

  @Input()
  public index: number;

  @Input()
  public userData: UserData;

  @Input()
  public exchange: Exchange;

  @Input()
  public timeframeView: 'dropdown' | 'list' = 'list';

  @Input()
  public coinData: CoinData;

  @Input()
  public preferences: Preferences;

  @Input()
  public timeframe: Timeframe;

  @Input()
  public chartSettings: ChartSettings;

  @Input()
  public fullChart: boolean;

  @Input()
  public formation: Formations;

  @Input()
  public alerts: Alert[];

  @Input()
  public watchlistCoins: WatchlistCoin[];

  @Input()
  public chartIndicators: ChartTechnicalIndicators[];

  @Output()
  public openChart: EventEmitter<CoinData> = new EventEmitter<CoinData>();

  @Output()
  public candlesLenUpdated: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public chartIndicatorsUpdated: EventEmitter<ChartTechnicalIndicators[]> =
    new EventEmitter<ChartTechnicalIndicators[]>();

  public isVisible: boolean = false;
  public isVisibleForFake: boolean = false;
  public chartIsActive: boolean = false;
  private observer: IntersectionObserver;

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private nightVisionChartService: NightVisionChartService,
  ) {}

  public ngOnChanges({ coin }: SimpleChanges): void {
    if (coin && coin.currentValue !== coin.previousValue) {
      this.nightVisionChartService.destroy(
        coin.previousValue,
        this.exchange,
        this.timeframe,
      );
    }
  }

  public ngOnDestroy(): void {
    this.nightVisionChartService.destroy(
      this.coin,
      this.exchange,
      this.timeframe,
    );
  }

  public ngAfterViewInit(): void {
    // this.detectViewport();
  }

  public ngAfterViewChecked(): void {
    this.detectViewport();
  }

  public redirectToPremium(): void {
    this.router.navigate(['app', 'premium']);
  }

  private detectViewport(): void {
    if (!this.elementRef.nativeElement) {
      return void 0;
    }

    this.observer?.unobserve(this.elementRef.nativeElement);
    this.observer?.disconnect();

    this.observer = new IntersectionObserver(([entry]) => {
      this.isVisible =
        entry.isIntersecting &&
        (this.userData?.premium_enabled ||
          (!this.userData?.premium_enabled && this.index < 10));
      this.isVisibleForFake = entry.isIntersecting;

      if (!this.isVisible) {
        this.nightVisionChartService.destroy(
          this.coin,
          this.exchange,
          this.timeframe,
        );
      }

      this.cdr.detectChanges();

      // if (!this.isVisible) {
      //   this.isVisible = entry.isIntersecting;
      //   this.cdr.detectChanges();
      // }
    });

    this.observer.observe(this.elementRef.nativeElement);
  }
}
