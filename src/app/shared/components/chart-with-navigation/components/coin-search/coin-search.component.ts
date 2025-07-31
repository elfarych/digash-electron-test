import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../menu/menu.component';
import { WorkspaceCoins } from '../../../../models/WorkspaceCoins';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { AutoCompleteOnSelectEvent } from 'primeng/autocomplete/autocomplete.interface';
import { KeyboardService } from '../../../../services/keyboard.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-coin-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './coin-search.component.html',
  styleUrls: ['./coin-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinSearchComponent implements OnDestroy {
  @Input()
  public coins: WorkspaceCoins[] = [];

  @Output()
  public selectSymbol: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MenuComponent)
  public menu: MenuComponent;

  @ViewChild('searchField')
  public searchFieldEl: ElementRef<HTMLInputElement>;

  public filteredSymbols: WorkspaceCoins[];
  public selectedSymbol: WorkspaceCoins;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private keyboardService: KeyboardService,
  ) {}

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public handleSelectSymbol(event: AutoCompleteOnSelectEvent): void {
    this.selectSymbol.emit(event.value.symbol);
    this.selectedSymbol = undefined;
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
    const query = this.keyboardService.convertRussianToEnglish(event.query);

    for (let i = 0; i < (this.coins as WorkspaceCoins[]).length; i++) {
      const coin = (this.coins as WorkspaceCoins[])[i];
      if (coin.symbol.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(coin);
      }
    }

    this.filteredSymbols = filtered;

    // if (!value) {
    //   return this.coins;
    // }
    //
    // const filterValue = value.toLowerCase();
    // return this.coins.filter(option => option.symbol.toLowerCase().includes(filterValue)).sort();
  }

  public onInputChange(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    input.value = this.keyboardService.convertRussianToEnglish(input.value);
  }
}
