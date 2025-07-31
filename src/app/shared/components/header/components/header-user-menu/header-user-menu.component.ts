import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../../../../models/Auth';
import { MenuComponent } from '../../../menu/menu.component';
import { MenuTriggerDirective } from '../../../menu/menu-trigger.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    MenuTriggerDirective,
    AngularSvgIconModule,
    RouterLink,
    MatIconModule,
    MatRippleModule,
    ButtonModule,
    SplitButtonModule,
    MenuModule,
    TranslateModule,
  ],
  templateUrl: './header-user-menu.component.html',
  styleUrls: ['./header-user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserMenuComponent {
  @Output()
  public login: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public logout: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public selectLanguage: EventEmitter<'RU' | 'EN'> = new EventEmitter<
    'RU' | 'EN'
  >();

  @Input()
  public isAuth: boolean;

  @Input()
  public user: UserData;

  @ViewChild('menuLanguage')
  public menuLanguageEl: MenuComponent;

  constructor(
    private router: Router,
    private translateService: TranslateService,
  ) {
    this.translateService.onLangChange.subscribe(
      () => (this.items = this.generateItems()),
    );
  }

  public items: MenuItem[] = this.generateItems();

  private generateItems() {
    return [
      {
        label: this.translateService.instant('app.profile'),
        icon: 'pi pi-user',
        command: () => this.router.navigate(['app', 'profile']),
      },
      {
        label: this.translateService.instant('app.sign_out'),
        icon: 'pi pi-fw pi-power-off',
        command: () => this.logout.emit(),
      },
    ];
  }
}
