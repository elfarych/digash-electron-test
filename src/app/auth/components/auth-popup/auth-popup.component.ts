import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { AuthStatus } from '../../../shared/models/Auth';
import { LoginComponent } from '../login/login.component';
import { Observable } from 'rxjs';
import { AuthService } from '../../data-access/auth.service';
import { RegisterComponent } from '../register/register.component';
import { RestoreComponent } from '../restore/restore.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'hive-auth-popup',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    RegisterComponent,
    RestoreComponent,
    AngularSvgIconModule,
    ToastModule,
    TranslateModule,
    ErrorMessageComponent,
  ],
  templateUrl: './auth-popup.component.html',
  styleUrls: ['./auth-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class AuthPopupComponent implements OnInit, OnDestroy {
  public errorMessage$: Observable<string> =
    this.authService.getAuthErrorMessage();
  public authStatus: AuthStatus;
  private dialogRef: DynamicDialogRef | undefined;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    @Inject(DynamicDialogConfig) public data: { data: { status: AuthStatus } },
  ) {}

  public ngOnInit(): void {
    this.authStatus = this.data.data.status;
  }

  public ngOnDestroy(): void {
    this.authService.clearErrorMessages();
  }

  public redirectToSignup(): void {
    this.authStatus = 'register';
    this.authService.clearErrorMessages();
    this.cdr.detectChanges();
  }

  public redirectToSignIn(): void {
    this.authStatus = 'login';
    this.authService.clearErrorMessages();
    this.cdr.detectChanges();
  }

  public redirectToRestore(): void {
    this.authStatus = 'restore';
    this.authService.clearErrorMessages();
    this.cdr.detectChanges();
  }
}
