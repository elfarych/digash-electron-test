import { Injectable } from '@angular/core';
import { AppColorTheme } from '../../../../models/Preferences';

@Injectable({
  providedIn: 'root',
})
export class AppColorThemeSelectorService {
  private defaultBodyClass = 'mat-typography';

  public switchAppColorTheme(theme: AppColorTheme) {
    const link = document.getElementById('app-theme') as HTMLLinkElement;

    this.removeBodyAllClasses();
    this.addBodyClass(theme.src.replace('.css', ''));

    if (theme.dark) {
      this.addBodyClass('dark-theme');
    }

    if (!theme.dark) {
      this.addBodyClass('light-theme');
    }

    if (link) {
      link.href = theme.src;
    }
  }

  private addBodyClass(className: string) {
    if (!document.body.classList.contains(className)) {
      document.body.classList.add(className);
    }
  }

  private removeBodyAllClasses() {
    document.body.className = this.defaultBodyClass;
  }
}
