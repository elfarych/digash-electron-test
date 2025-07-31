import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Preferences } from '../../models/Preferences';
import { NotificationsService } from '../../store/notifications/notifciations.service';
import { UserData } from '../../models/Auth';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Observable, Subscription } from 'rxjs';
import { AlertNotification } from '../../models/Notification';
import { HeaderUserMenuComponent } from './components/header-user-menu/header-user-menu.component';
import { HeaderNotificationsMenuComponent } from './components/header-notifications-menu/header-notifications-menu.component';
import { PsychologyPopupComponent } from '../../../pages/psychology/components/psychology-popup/psychology-popup.component';
import { ToolbarModule } from 'primeng/toolbar';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { DialogService } from 'primeng/dynamicdialog';
import { UnauthorizedDirective } from '../../directives/unauthorized.directive';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { TranslateService } from '@ngx-translate/core';
import { HotkeyMapComponent } from '../hotkey-map/hotkey-map.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    HeaderUserMenuComponent,
    HeaderNotificationsMenuComponent,
    ToolbarModule,
    MenubarModule,
    ButtonModule,
    OverlayPanelModule,
    BadgeModule,
    MenuModule,
    UnauthorizedDirective,
    LanguageSwitcherComponent,
    HotkeyMapComponent,
  ],
  providers: [DialogService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  public landingPage = false;

  @Input()
  public navMenuIsOpen!: boolean;

  @Input()
  public online: { online: number };

  @Input()
  public preferences: Preferences;

  @Output()
  public handleNavMenuToggle: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public openPreferences: EventEmitter<void> = new EventEmitter<void>();

  public items = this.generateItems();

  public isAuth$: Observable<boolean> = this.authService.getIsAuth();
  public user$: Observable<UserData> = this.authService.getUserData();
  public notifications$: Observable<AlertNotification[]> =
    this.notificationsService.getNotifications();
  public newNotifications = 0;
  public logoSrc: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    public dialogService: DialogService,
    private router: Router,
    private translateService: TranslateService,
  ) {
    this.translateService.onLangChange.subscribe(
      () => (this.items = this.generateItems()),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  public ngOnInit(): void {
    this.notifications$.subscribe((notifications: AlertNotification[]) => {
      this.newNotifications = notifications.reduce(
        (acc, notification) => acc + (notification.watched ? 0 : 1),
        0,
      );
    });
  }

  public ngOnChanges({ preferences }: SimpleChanges) {
    if (preferences) {
      this.setLogoSrc();
    }
  }

  public handleLogin(): void {
    this.authService.openAuthPopup();
  }

  public handleLogout(): void {
    this.authService.dispatchLogout();
    this.router.navigate(['app', 'charts-screener']);
  }

  public viewAllNotifications(): void {
    this.notificationsService.viewAll();
  }

  public openPsychologyPopup(): void {
    this.dialogService.open(PsychologyPopupComponent, {
      width: '720px',
      draggable: true,
    });
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.key === '!') {
      this.router.navigate(['app', 'charts-screener']);
    }
    if (event.shiftKey && event.key === '@') {
      this.router.navigate(['app', 'coins-view', 'BINANCE_SPOT', 'BTCUSDT']);
    }
    if (event.shiftKey && event.key === '#') {
      this.router.navigate(['app', 'depth-map']);
    }
    if (event.shiftKey && event.key === '$') {
      this.router.navigate(['app', 'alerts']);
    }
  }

  private setLogoSrc(): void {
    const lightThemeLogoSrc = 'assets/svg/logo_full_dark.svg';
    const darkThemeLogoSrc = 'assets/svg/logo_full.svg';
    this.logoSrc = document.body.classList.contains('light-theme')
      ? lightThemeLogoSrc
      : darkThemeLogoSrc;
  }

  private generateItems() {
    return [
      {
        label: this.translateService.instant('header.screener'),
        routerLink: '/app/charts-screener',
        target: '_self',
      },
      {
        label: this.translateService.instant('header.coins'),
        routerLink: '/app/coins-view',
        target: '_self',
      },

      {
        label: this.translateService.instant('header.depth_map'),
        routerLink: '/app/depth-map',
        target: '_self',
      },
      {
        label: this.translateService.instant('header.alerts'),
        routerLink: '/app/alerts',
        target: '_self',
      },
      {
        label: this.translateService.instant('header.psychology'),
        routerLink: '/app/psychology',
        target: '_self',
      },
      {
        label: this.translateService.instant('header.premium'),
        routerLink: '/app/premium',
        target: '_self',
        // badge: "new-year"
      },
      {
        label: this.translateService.instant('header.listings'),
        routerLink: '/app/listings',
        target: '_self',
      },
      {
        label: this.translateService.instant('header.update'),
        routerLink: '/app/updates',
        target: '_self',
      },
    ];
  }

  protected readonly String = String;
}
