import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SvgIconComponent } from 'angular-svg-icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PreferencesService } from '../../shared/components/preferences/data-access/preferences.service';
import { PreferencesComponent } from '../../shared/components/preferences/preferences.component';
import { Preferences } from '../../shared/models/Preferences';
import { AppResources } from './app.resources';
import { firstValueFrom, Observable } from 'rxjs';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PromotionDialogComponent } from '../../shared/components/promotion-dialog/promotion-dialog.component';
import { TooltipsComponent } from '../../shared/components/tooltips/tooltips.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { PremiumNewYearComponent } from 'src/app/shared/components/premium/components/premium-new-year/premium-new-year.component';
import { NotificationsService } from '../../shared/store/notifications/notifciations.service';

@Component({
  selector: 'app-app',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavigationComponent,
    MatSidenavModule,
    SvgIconComponent,
    MatButtonModule,
    MatRippleModule,
    HeaderComponent,
    PreferencesComponent,
    SidebarModule,
    ToastModule,
    PromotionDialogComponent,
    TooltipsComponent,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    PremiumNewYearComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  public showPreferences = false;
  public preferences$: Observable<Preferences> =
    this.prefencesService.preferences$;

  public constructor(
    private resources: AppResources,
    private messageService: MessageService,
    private translateService: TranslateService,
    private prefencesService: PreferencesService,
    private notificationsService: NotificationsService,
  ) {
    // this.ping();

    this.translateService.onLangChange.subscribe(
      (locale) => ((window as any).locale = locale.lang),
    );
    (window as any).locale = this.translateService.currentLang;
  }

  public ngOnInit(): void {
    this.notificationsService.triggerSetupNotifications();
  }

  @HostListener('window:visibilitychange', ['$event'])
  public handleUserComesBack(event): void {
    if (!document.hidden) {
      this.notificationsService.triggerSetupNotifications();
    }
  }

  public async ping(): Promise<void> {
    try {
      await firstValueFrom(this.resources.ping());
    } catch (e) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant(
          'ERROR_CODES.UNSTABLE_SERVER_CONNECTION',
        ),
        detail: this.translateService.instant(
          'ERROR_CODES.DIGASH_CONNECTION_ISSUE',
        ),
        life: 2000,
      });
    }
  }
}
