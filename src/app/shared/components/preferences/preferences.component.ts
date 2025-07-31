import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { PreferencesService } from './data-access/preferences.service';
import {
  debounceTime,
  filter,
  firstValueFrom,
  Observable,
  Subscription,
  take,
  withLatestFrom,
} from 'rxjs';
import { AppTheme, Preferences } from '../../models/Preferences';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { initialPreferencesState } from './data-access/preferences.reducer';
import { Layout } from '../../models/Layout';
import {
  allSortingColumns,
  CoinSortingType,
  SortingId,
} from '../../models/CoinsSorting';
import { MenuComponent } from '../menu/menu.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ColorPickerModule,
    ColorPickerModule,
    SelectButtonModule,
    ButtonModule,
    DividerModule,
    ConfirmPopupModule,
    TranslateModule,
    DropdownModule,
  ],
  templateUrl: './preferences.component.html',
  providers: [ConfirmationService],
  styleUrls: ['./preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent implements OnInit, OnDestroy {
  @ViewChild(MenuComponent)
  public menuComponent: MenuComponent;

  public preferences$: Observable<Preferences> = this.service.preferences$;
  public preferencesLoaded$: Observable<boolean> =
    this.service.preferencesLoaded$;
  public selectPreferencesTheme$: Observable<string> =
    this.service.selectPreferencesTheme$;

  public form: FormGroup = new FormGroup({
    lineValue: new FormControl<SortingId>(initialPreferencesState.lineValue),
    layout: new FormControl<Layout>(initialPreferencesState.layout),
    theme: new FormControl<AppTheme>('dark'),
  });

  public coinLineOptions = allSortingColumns(this.translateService).filter(
    (option) => option.id !== 'Coin',
  );

  public themeOptions = [
    {
      value: 'dark',
      label: this.translateService.instant('preferences.darkTheme'),
    },
    {
      value: 'light',
      label: this.translateService.instant('preferences.lightTheme'),
    },
  ];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private service: PreferencesService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private renderer: Renderer2,
  ) {}

  public ngOnInit(): void {
    this.preferencesLoaded$
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.prepatchValues());

    this.subscriptions.add(
      this.preferences$.subscribe((value) => this.setTheme(value)),
    );
  }

  public async updateAppColorThemePreferences(appColorThemeSrc: string) {
    const preferences = await firstValueFrom(this.preferences$);
    this.service.updatePreferences({ ...preferences, appColorThemeSrc });
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public selectLineOption(value: CoinSortingType): void {
    this.form.get('lineValue').setValue(value.id);
    this.menuComponent.close();
  }

  public selectLayout(layout: Layout): void {
    this.form.get('layout').setValue(layout);
  }

  public getReadableLineOptionName(): string {
    return (
      this.coinLineOptions.find(
        (option) => option.id === this.form.get('lineValue').value,
      )?.label ?? ''
    );
  }

  public clearWatchlist(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('preferences.clearFavorites'),
      message: this.translateService.instant(
        'app.preferences.clearFavoritesQuestion',
      ),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translateService.instant('app.preferences.yes'),
      rejectLabel: this.translateService.instant('app.preferences.cancel'),
      accept: () => {
        this.service.clearWatchlist();
      },
    });
  }

  private async prepatchValues(): Promise<void> {
    const preferences = await firstValueFrom(this.preferences$);
    this.form.patchValue({
      layout: preferences.layout ?? initialPreferencesState.layout,
      theme: preferences.theme ?? initialPreferencesState.layout,
      lineValue: preferences.lineValue ?? initialPreferencesState.lineValue,
    });

    this.subscriptions.add(
      this.form.valueChanges
        .pipe(debounceTime(500), withLatestFrom(this.preferences$))
        .subscribe(([values, pref]) => {
          return this.service.updatePreferences({
            ...pref,
            ...values,
            chartLayout: pref.chartLayout,
          });
        }),
    );
  }

  private async setTheme(preferences: Preferences): Promise<void> {
    if (preferences.theme === 'light') {
      this.renderer.addClass(document.body, 'light-theme');
    } else {
      this.renderer.removeClass(document.body, 'light-theme');
    }
  }
}
