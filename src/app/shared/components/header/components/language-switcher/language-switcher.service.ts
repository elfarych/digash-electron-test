import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherResources } from './language-switcher.resources';

@Injectable({ providedIn: 'root' })
export class LanguageSwitcherService {
  constructor(
    private translateService: TranslateService,
    private resources: LanguageSwitcherResources,
  ) {}

  public languageChange(locale: string): void {
    this.translateService.use(locale);
    this.updateUserLocale(locale);
  }

  private updateUserLocale(locale: string): void {
    this.resources.updateUserLocale(locale);
  }
}
