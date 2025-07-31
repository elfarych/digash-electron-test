import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTriggerDirective } from '../menu/menu-trigger.directive';
import { MenuComponent } from '../menu/menu.component';
import { Exchange, getExchangeData } from '../../models/Exchange';
import { SvgIconComponent } from 'angular-svg-icon';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-exchange-selector',
  standalone: true,
  imports: [
    CommonModule,
    MenuTriggerDirective,
    SvgIconComponent,
    MenuComponent,
    DropdownModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './exchange-selector.component.html',
  styleUrls: ['./exchange-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeSelectorComponent {
  @Input()
  public selectedMarket: Exchange = 'BINANCE_SPOT';

  @Input()
  public includedExchanges: Exchange[] = [];

  @Input()
  public excludedExchanges: Exchange[] = [];

  @Input()
  public premium: boolean;

  @Input()
  public readonly = false;

  @Input()
  public showOnlyMainExchanges: boolean = false;

  @Output()
  public exchangeChange: EventEmitter<Exchange> = new EventEmitter<Exchange>();

  public readableExchangeName: string;
  public exchanges: { value: Exchange; label: string; isDisable?: boolean }[] =
    [];

  constructor(private translateService: TranslateService) {}

  public ngOnChanges({
    selectedMarket,
    premium,
    excludedExchanges,
    includedExchanges,
  }: SimpleChanges): void {
    if (selectedMarket) {
      this.readableExchangeName = this.handleReadableExchangeName();
    }

    if (excludedExchanges || includedExchanges || premium) {
      this.setExchanges();
      this.filterExchanges();
    }
  }

  public handleExchangeChange(event: DropdownChangeEvent): void {
    event.originalEvent.stopPropagation();
    this.exchangeChange.emit(event.value);
  }

  private filterExchanges(): void {
    if (this.includedExchanges?.length) {
      this.exchanges = this.exchanges.filter((e) =>
        this.includedExchanges.includes(e.value),
      );
    }

    if (this.excludedExchanges?.length) {
      this.exchanges = this.exchanges.filter(
        (e) => !this.excludedExchanges.includes(e.value),
      );
    }
  }

  private setExchanges(): void {
    if (this.showOnlyMainExchanges) {
      this.exchanges = [
        {
          value: 'ALL',
          label: this.translateService.instant('chart.all_exchanges'),
          isDisable: !this.premium,
        },
        {
          value: 'BINANCE_SPOT',
          label: this.translateService.instant('chart.binance_spot'),
          isDisable: !this.premium,
        },
        {
          value: 'BINANCE_FUTURES',
          label: this.translateService.instant('chart.binance_futures'),
        },
        {
          value: 'BYBIT_SPOT',
          label: `${this.translateService.instant('chart.bybit_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BYBIT_FUTURES',
          label: `${this.translateService.instant('chart.bybit_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BITGET_SPOT',
          label: `${this.translateService.instant('chart.bitget_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BITGET_FUTURES',
          label: `${this.translateService.instant('chart.bitget_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BITGET_SPOT',
          label: `${this.translateService.instant('chart.bitget_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BITGET_FUTURES',
          label: `${this.translateService.instant('chart.bitget_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },

        {
          value: 'GATE_SPOT',
          label: `${this.translateService.instant('chart.gate_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'GATE_FUTURES',
          label: `${this.translateService.instant('chart.gate_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },

        {
          value: 'OKX_SPOT',
          label: `${this.translateService.instant('chart.okx_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'OKX_FUTURES',
          label: `${this.translateService.instant('chart.okx_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'MEXC_SPOT',
          label: `${this.translateService.instant('chart.mexc_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'MEXC_FUTURES',
          label: `${this.translateService.instant('chart.mexc_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
      ];
    } else {
      this.exchanges = [
        {
          value: 'BINANCE_SPOT',
          label: `${this.translateService.instant('chart.binance_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BINANCE_SPOT_WITHOUT_FUTURES',
          label: `${this.translateService.instant('chart.binance_spot_without_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BINANCE_SPOT_WITH_FUTURES',
          label: `${this.translateService.instant('chart.binance_spot_with_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BINANCE_FUTURES',
          label: this.translateService.instant('chart.binance_futures'),
        },

        {
          value: 'BYBIT_SPOT',
          label: `${this.translateService.instant('chart.bybit_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BYBIT_FUTURES',
          label: `${this.translateService.instant('chart.bybit_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },

        {
          value: 'BITGET_SPOT',
          label: `${this.translateService.instant('chart.bitget_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BITGET_FUTURES',
          label: `${this.translateService.instant('chart.bitget_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },

        {
          value: 'BITGET_SPOT_WITHOUT_BINANCE',
          label: `${this.translateService.instant('chart.bitget_spot_without_binance')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'BITGET_FUTURES_WITHOUT_BINANCE',
          label: `${this.translateService.instant('chart.bitget_futures_without_binance')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },

        {
          value: 'GATE_SPOT',
          label: `${this.translateService.instant('chart.gate_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'GATE_FUTURES',
          label: `${this.translateService.instant('chart.gate_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },

        {
          value: 'OKX_SPOT',
          label: `${this.translateService.instant('chart.okx_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'OKX_FUTURES',
          label: `${this.translateService.instant('chart.okx_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },

        {
          value: 'MEXC_SPOT',
          label: `${this.translateService.instant('chart.mexc_spot')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
        {
          value: 'MEXC_FUTURES',
          label: `${this.translateService.instant('chart.mexc_futures')} ${!this.premium ? this.translateService.instant('chart.premium_brackets') : ''}`,
          isDisable: !this.premium,
        },
      ];
    }
  }

  private handleReadableExchangeName(): string {
    return this.translateService.instant(
      `chart.${getExchangeData(this.selectedMarket)?.translateKey}`,
    );
  }

  protected readonly getExchangeData = getExchangeData;
}
