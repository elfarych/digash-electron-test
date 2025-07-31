import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { AutoCompleteOnSelectEvent } from 'primeng/autocomplete/autocomplete.interface';
import { WorkspaceCoins } from '../../models/WorkspaceCoins';
import { MenuComponent } from '../menu/menu.component';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-blacklist-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    FormsModule,
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './blacklist-builder.component.html',
  styleUrls: ['./blacklist-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlacklistBuilderComponent {
  @Input()
  public coins: WorkspaceCoins[] | { symbol: string }[] = [];

  @Input()
  public blacklist: string[] = [];

  @Input()
  public disabled = false;

  @Output()
  public selectSymbol: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MenuComponent)
  public menu: MenuComponent;

  @ViewChild('searchField')
  public searchFieldEl: ElementRef<HTMLInputElement>;

  @ViewChild('autoComplete', { static: false })
  public autoComplete: AutoComplete;

  public filteredSymbols: WorkspaceCoins[];
  public selectedSymbol: string;

  constructor(private cdr: ChangeDetectorRef) {}

  public handleSelectSymbol(event: AutoCompleteOnSelectEvent): void {
    this.selectSymbol.emit(event.value.symbol);
    this.autoComplete.clear();
  }

  public onCoinClick(coin: string): void {
    this.selectSymbol.emit(coin);
  }

  @HostListener('document:keydown', ['$event'])
  public handleTilda(event: KeyboardEvent): void {
    if (event.code === 'Backquote') {
      this.menu.toggle();
      this.searchFieldEl.nativeElement.focus();
    }
  }

  public filterSymbols(event: AutoCompleteCompleteEvent): void {
    const filtered: WorkspaceCoins[] = [];
    const query = event.query;

    for (let i = 0; i < (this.coins as WorkspaceCoins[]).length; i++) {
      const coin = (this.coins as WorkspaceCoins[])[i];
      if (coin.symbol.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(coin);
      }
    }

    this.filteredSymbols = filtered;
  }

  protected readonly PrimeIcons = PrimeIcons;
}
