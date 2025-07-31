import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { filter, take } from 'rxjs';
import { AuthService } from '../../../../../auth/data-access/auth.service';
import { LanguageSwitcherService } from './language-switcher.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent implements OnInit {
  public languages: any[] | undefined;

  public selectedLanguage: { name: string; code: string } = {
    name: 'Русский',
    code: 'ru',
  };

  constructor(
    private service: LanguageSwitcherService,
    private authService: AuthService,
  ) {}

  public ngOnInit() {
    this.languages = [
      { name: 'Ru', code: 'ru' },
      { name: 'En', code: 'en' },
      { name: 'Uk', code: 'uk' },
      { name: 'Hi', code: 'hi' },
      { name: 'Bn', code: 'bn' },
      { name: 'Es', code: 'es' },
      { name: 'Pt', code: 'pt' },
    ];
    this.selectedLanguage = this.languages[0];
    this.authService
      .getUserData()
      .pipe(filter(Boolean), take(2))
      .subscribe((data) => {
        this.selectedLanguage =
          this.languages.find((l) => l.code === data.locale) ??
          this.languages[0];
      });
  }

  public languageChange(): void {
    this.service.languageChange(this.selectedLanguage.code);
    setTimeout(() => window.location.reload(), 1000);
  }
}
