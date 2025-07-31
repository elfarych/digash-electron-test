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
import {
  Exchange,
  ExchangeData,
  getExchangesData,
} from '../../models/Exchange';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-exclude-exchanges',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SvgIconComponent,
  ],
  templateUrl: './exclude-exchanges.component.html',
  styleUrls: ['./exclude-exchanges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcludeExchangesComponent implements OnChanges {
  @Input()
  public selectedExchange: Exchange;

  @Input()
  public excludedExchanges: Exchange[] = [];

  @Input()
  public grid: number = 3;

  @Output()
  public exclude: EventEmitter<Exchange[]> = new EventEmitter<Exchange[]>();

  public exchangesData: ExchangeData[] = [];

  public ngOnChanges({ selectedExchange }: SimpleChanges) {
    if (selectedExchange) {
      this.exchangesData = getExchangesData().filter(
        (e) => e.exchange !== selectedExchange.currentValue,
      );
    }
  }

  public get gridClass(): string {
    return `grid-${this.grid}-1`;
  }

  public excludeExchange(exchange: Exchange): void {
    const excludedExchangesTmp = JSON.parse(
      JSON.stringify(this.excludedExchanges),
    );
    const index = this.excludedExchanges.findIndex((e) => e === exchange);
    if (index !== -1) {
      excludedExchangesTmp.splice(index, 1);
    } else {
      excludedExchangesTmp.push(exchange);
    }

    this.exclude.emit(excludedExchangesTmp);
  }
}
