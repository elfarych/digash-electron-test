import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { OrderbookMapSettings } from '../../utils/models';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-orderbook-map-loader',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './orderbook-map-loader.component.html',
  styleUrls: ['./orderbook-map-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderbookMapLoaderComponent implements OnInit, OnDestroy {
  @Input()
  public settings$: Observable<OrderbookMapSettings>;

  @Input()
  public loading: boolean = false;

  @Output()
  public reloadData: EventEmitter<void> = new EventEmitter<void>();

  public reloadButtonDisabled: boolean = true;

  private dataLoaderIntervalSec: number = 0;
  private dataLoaderInterval: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  public ngOnInit() {
    this.settings$.subscribe((settings) => {
      if (settings) this.setLoader(settings);
    });
  }

  public ngOnDestroy(): void {
    this.clearDataLoaderInterval();
  }

  public manualReload(): void {
    this.reloadData.emit();
    this.changeReloadButtonDisabledState();
  }

  private changeReloadButtonDisabledState(): void {
    this.reloadButtonDisabled = true;
    setTimeout(() => {
      this.reloadButtonDisabled = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  private setLoader(settings: OrderbookMapSettings): void {
    if (settings.loaderMode === 'manual') {
      this.reloadButtonDisabled = false;
      this.clearDataLoaderInterval();
      return;
    } else {
      this.reloadButtonDisabled = true;
    }

    if (this.dataLoaderIntervalSec !== settings.loaderIntervalSec) {
      this.dataLoaderIntervalSec =
        settings.loaderIntervalSec > 15 ? settings.loaderIntervalSec : 15;
      this.restartDataLoaderInterval(this.dataLoaderIntervalSec);
    }
  }

  private clearDataLoaderInterval(): void {
    if (this.dataLoaderInterval) {
      clearInterval(this.dataLoaderInterval);
      this.dataLoaderInterval = null;
    }
  }

  private restartDataLoaderInterval(intervalSec: number): void {
    this.clearDataLoaderInterval();
    this.dataLoaderInterval = setInterval(() => {
      this.reloadData.emit();
    }, 1000 * intervalSec);
  }

  protected readonly PrimeIcons = PrimeIcons;
}
