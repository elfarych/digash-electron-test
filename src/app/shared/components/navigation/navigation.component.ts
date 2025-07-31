import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SvgIconComponent,
    MatSidenavModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @Output()
  public redirect: EventEmitter<void> = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  public openMenu() {}
}
