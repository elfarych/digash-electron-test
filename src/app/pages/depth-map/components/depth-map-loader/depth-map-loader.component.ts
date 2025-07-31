import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DepthMapSettings } from '../../utils/models';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-depth-map-loader',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './depth-map-loader.component.html',
  styleUrls: ['./depth-map-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthMapLoaderComponent implements OnInit {
  @Input()
  public settings$: Observable<DepthMapSettings>;

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

  private setLoader(settings: DepthMapSettings): void {
    if (settings.loaderMode === 'manual') {
      this.reloadButtonDisabled = false;
      this.clearDataLoaderInterval();
      return;
    } else {
      this.reloadButtonDisabled = true;
    }

    if (this.dataLoaderIntervalSec !== settings.loaderIntervalSec) {
      this.dataLoaderIntervalSec = settings.loaderIntervalSec;
      this.restartDataLoaderInterval(settings.loaderIntervalSec);
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
