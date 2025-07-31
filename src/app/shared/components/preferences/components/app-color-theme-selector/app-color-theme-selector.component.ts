import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { AppColorTheme, appColorThemes } from '../../../../models/Preferences';
import { AppColorThemeSelectorService } from './app-color-theme-selector.service';
import { FormsModule } from '@angular/forms';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { CommonModule, NgSwitchCase } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-app-color-theme-selector',
  templateUrl: './app-color-theme-selector.component.html',
  styleUrls: ['./app-color-theme-selector.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    NgSwitchCase,
    SvgIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppColorThemeSelectorComponent implements OnInit, OnChanges {
  @Input()
  public appColorThemeSrc: string;

  @Output()
  public updateAppColorThemeInPreferences: EventEmitter<string> =
    new EventEmitter<string>();

  public appColorThemes: AppColorTheme[] = appColorThemes;
  public appColorThemesOptions: { value: string; label: string }[] = [];
  public selectedAppColorThemeSrc: string;
  public selectedAppColorTheme: AppColorTheme;

  constructor(private service: AppColorThemeSelectorService) {}

  public ngOnInit(): void {
    this.setColorThemeOptions();
    this.setAppColorTheme(this.appColorThemeSrc || this.appColorThemes[0].src);
  }

  public ngOnChanges({ appColorThemeSrc }: SimpleChanges): void {
    if (appColorThemeSrc) {
      this.setAppColorTheme(
        appColorThemeSrc.currentValue || this.appColorThemes[0]?.src,
      );
    }
  }

  private setAppColorTheme(themeSrc: string) {
    const selectedAppTheme = this.appColorThemes.find(
      (t) => t.src === themeSrc,
    );
    if (selectedAppTheme) {
      this.selectedAppColorThemeSrc = selectedAppTheme.src;
      this.selectedAppColorTheme = selectedAppTheme;
      this.switchAppColorTheme(selectedAppTheme);
    }
  }

  private setColorThemeOptions() {
    this.appColorThemesOptions = this.appColorThemes.map((t) => ({
      value: t.src,
      label: t.name,
      color: t.color,
      bgColor: t.bgColor,
    }));
  }

  public switchAppColorTheme(theme: AppColorTheme) {
    this.service.switchAppColorTheme(theme);
  }

  public handleAppColorThemeChange(event: DropdownChangeEvent) {
    this.setAppColorTheme(event.value);
    this.updateAppColorThemeInPreferences.emit(event.value);
  }
}
