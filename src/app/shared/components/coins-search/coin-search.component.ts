import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { KeyboardService } from '../../services/keyboard.service';
import { debounceTime } from 'rxjs';
import { PanelModule } from 'primeng/panel';
import { CoinModel } from './utils/coin.model';
import { CoinSearchService } from './coin-search.service';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { getExchangeData } from '../../models/Exchange';
import { SvgIconComponent } from 'angular-svg-icon';
import { SpinnerModule } from 'primeng/spinner';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-coins-search',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    PanelModule,
    InputTextModule,
    FormsModule,
    TreeModule,
    SvgIconComponent,
    ReactiveFormsModule,
    SpinnerModule,
    ButtonModule,
    ScrollPanelModule,
    ProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './coin-search.component.html',
  styleUrls: ['./coin-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinSearchComponent implements OnInit {
  public searchDialogVisible: boolean = false;
  public height: number = 60; // VH
  public coins: CoinModel[] = [];
  public loading: boolean = true;

  public searchForm: FormGroup = new FormGroup({
    searchText: new FormControl(''),
  });

  private befoareSearchLetters: string[] = [];

  @ViewChild('inputField', { static: true }) private inputField!: ElementRef;
  private timeoutRef: any;

  constructor(
    private keyboardService: KeyboardService,
    private service: CoinSearchService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  public ngOnInit() {
    this.searchForm
      .get('searchText')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value.length > 1) {
          this.loadCoins(value);
        }
      });
  }

  @HostListener('document:keydown', ['$event'])
  private async handleKeyboardEvent(event: KeyboardEvent): Promise<void> {
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      return void 0;
    }

    const isIgnoredElement: boolean = this.checkElementIsIgnore();
    if (isIgnoredElement) return void 0;

    const key: string = event.key;

    if (/^[a-zA-Zа-яА-ЯёЁ]$/.test(key)) {
      if (!this.searchDialogVisible) {
        const letter: string = this.keyboardService
          .convertRussianToEnglish(key)
          .toUpperCase();
        this.befoareSearchLetters.push(letter);
        this.searchForm
          .get('searchText')
          .setValue(this.befoareSearchLetters.join(''));

        if (this.searchForm.get('searchText').value.length > 1) {
          this.startSearch();
        } else {
          this.cleanBeforeSearchLetters();
        }
      }
    }

    this.resetClearTimer();
  }

  public onDialogHide(): void {
    this.searchForm.get('searchText').setValue('');
    this.coins = [];
    this.befoareSearchLetters = [];
  }

  public onInputChange(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    input.value = this.keyboardService
      .convertRussianToEnglish(input.value)
      .toUpperCase();
  }

  public navigateToCoinDetail(coin: CoinModel): void {
    this.searchDialogVisible = false;
    this.router.navigate(['app', 'coins-view', coin.market, coin.symbol]);
  }

  private resetClearTimer(): void {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }
    this.timeoutRef = setTimeout(() => {
      this.clearSearch();
    }, 5000);
  }

  private clearSearch(): void {
    this.searchForm.get('searchText')?.setValue('');
    this.inputField.nativeElement.value = '';
    this.befoareSearchLetters = [];
  }

  private startSearch(): void {
    this.loading = true;
    this.searchDialogVisible = true;
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    }, 0);
  }

  private async loadCoins(searchText: string): Promise<void> {
    if (searchText) {
      this.loading = true;
      this.cdr.detectChanges();
      this.coins = await this.service.loadCoins(this.convertText(searchText));
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private convertText(text: string): string {
    return text
      .split('')
      .map((t) => this.keyboardService.convertRussianToEnglish(t).toUpperCase())
      .join('');
  }

  private checkElementIsIgnore(): boolean {
    const activeElement = document.activeElement;
    const bodyClassList = document.body.classList;

    if (bodyClassList.contains('p-overflow-hidden')) return true;
    if (activeElement.tagName === 'INPUT') return true;
    if (activeElement.tagName === 'TEXTAREA') return true;

    return false;
  }

  private cleanBeforeSearchLetters(): void {
    setTimeout(() => {
      if (!this.searchDialogVisible) {
        this.befoareSearchLetters = [];
      }
    }, 5000);
  }

  protected readonly getExchangeData = getExchangeData;
}
