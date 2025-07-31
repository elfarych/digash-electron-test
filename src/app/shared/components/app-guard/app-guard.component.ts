import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding, OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/data-access/auth.service';
import {Observable, Subscription, take} from 'rxjs';
import { RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserData } from '../../models/Auth';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-guard',
  standalone: true,
  imports: [CommonModule, RouterLink, AngularSvgIconModule, ButtonModule, TranslateModule],
  templateUrl: './app-guard.component.html',
  styleUrls: ['./app-guard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppGuardComponent implements OnInit, AfterViewInit, OnDestroy {
  public isAuth$: Observable<boolean> = this.authService.getIsAuth();
  public user$: Observable<UserData> = this.authService.getUserData();

  public showGuard = true;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {}

  public ngOnInit(): void {
    // this.subscriptions.add(this.user$.subscribe((user: UserData) => {
    //   if (user) {
    //     this.elementRef.nativeElement.classList.remove('show');
    //     this.cdr.detectChanges();
    //     return void 0;
    //   }
    //
    //   this.elementRef.nativeElement.classList.add('show');
    //   this.cdr.detectChanges();
    // }));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public ngAfterViewInit(): void {
    // this.isAuth$.pipe(take(1)).subscribe((isAuth: boolean) => {
    //   if (!isAuth) {
    //     this.login();
    //   }
    // })
  }

  public login(): void {
    this.authService.openAuthPopup();
  }
}
